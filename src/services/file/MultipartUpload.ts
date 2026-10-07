import type {
	TCompleteMultipartUploadResponse,
	TMultipartUploadTarget,
	TUploadFileInPartsOptions,
} from '@/types/file'

import { createLinkedAbortController } from '@/lib/AbortUtils'
import { getMimeType, splitIntoChunks } from '@/lib/FileUtils'
import { createProgressTracker } from '@/lib/ProgressUtils'

import { fileService } from './FileService'
import { uploadParts } from './MultipartParts'

/**
 * initiate → (part-url → PUT to S3) per part → complete.
 *
 * initiate and complete ignore the cancel signal on purpose: initiate always
 * returns an uploadId so a cancel can be cleaned up, and once complete starts
 * the file is stored, so a cancel then must not report it as cancelled.
 * A failed part stops the others, and any failure or cancel before complete
 * aborts the upload on S3 so no orphaned parts are left behind.
 */

export async function uploadFileInParts(
	file: File,
	{ signal, onProgress }: TUploadFileInPartsOptions,
): Promise<TCompleteMultipartUploadResponse> {
	const { chunkSize, ...target } = await initiateUpload(file)
	const chunks = splitIntoChunks(file, chunkSize)

	/**
	 * Stops every part on a user cancel or on the first failed part
	 */

	const partsController = createLinkedAbortController(signal)

	try {
		const parts = await uploadParts(chunks, {
			target,
			signal: partsController.signal,
			onPartProgress: createProgressTracker(chunks.length, onProgress),
		})

		return await fileService.completeMultipartUpload({ ...target, parts })
	} catch (error) {
		partsController.abort()
		abortUploadQuietly(target)
		throw error
	} finally {
		partsController.dispose()
	}
}

function initiateUpload(file: File) {
	return fileService.initiateMultipartUpload({
		fileName: file.name,
		contentType: getMimeType(file),
	})
}

/**
 * Best-effort cleanup on S3: the user should see the original error, not a
 * failed abort
 */

function abortUploadQuietly(target: TMultipartUploadTarget) {
	void fileService.abortMultipartUpload(target).catch(() => undefined)
}
