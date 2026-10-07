import type {
	TCompletedPart,
	TCompleteMultipartUploadResponse,
	TUploadFileInPartsOptions,
} from '@/types/file'

import { getMimeType, splitIntoChunks } from '@/lib/FileUtils'
import { mapWithConcurrency, withRetry } from '@/lib/PromiseUtils'

import { isRetryableRequestError } from '../instance'
import { fileService } from './FileService'

const PART_CONCURRENCY: number = 4

const PART_RETRY_ATTEMPTS: number = 3

const PART_RETRY_BASE_DELAY_MS: number = 1000

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
	const { key, uploadId, chunkSize } =
		await fileService.initiateMultipartUpload({
			fileName: file.name,
			contentType: getMimeType(file),
		})
	const target = { key, uploadId }

	/**
	 * Stops every part on a user cancel or on the first failed part
	 */

	const partController = new AbortController()
	const partSignal = partController.signal
	const stopParts = () => partController.abort()

	if (signal.aborted) stopParts()
	else signal.addEventListener('abort', stopParts, { once: true })

	const chunks = splitIntoChunks(file, chunkSize)
	const loadedByPart: number[] = new Array(chunks.length).fill(0)

	const reportProgress = (index: number, loadedBytes: number) => {
		loadedByPart[index] = loadedBytes
		onProgress(loadedByPart.reduce((total, loaded) => total + loaded, 0))
	}

	const uploadPart = async (chunk: Blob, index: number) => {
		const partNumber = index + 1

		const url = await fileService.getPresignedPartUrl(
			{ ...target, partNumber },
			{ signal: partSignal },
		)

		reportProgress(index, 0)

		const etag = await fileService.uploadPart(url, chunk, {
			signal: partSignal,
			onUploadProgress: ({ loaded }) => reportProgress(index, loaded),
		})

		reportProgress(index, chunk.size)
		return { PartNumber: partNumber, ETag: etag } satisfies TCompletedPart
	}

	try {
		const parts = await mapWithConcurrency(
			chunks,
			PART_CONCURRENCY,
			(chunk, index) =>
				withRetry(() => uploadPart(chunk, index), {
					attempts: PART_RETRY_ATTEMPTS,
					baseDelayMs: PART_RETRY_BASE_DELAY_MS,
					signal: partSignal,
					shouldRetry: isRetryableRequestError,
				}),
		)

		return await fileService.completeMultipartUpload({ ...target, parts })
	} catch (error) {
		stopParts()
		void fileService.abortMultipartUpload(target).catch(() => undefined)
		throw error
	} finally {
		signal.removeEventListener('abort', stopParts)
	}
}
