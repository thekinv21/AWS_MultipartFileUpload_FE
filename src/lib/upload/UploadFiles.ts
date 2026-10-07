import type { TUploadFilesOptions, TUploadItem } from '@/types/file'

import { getTotalSize } from '@/lib/FileUtils'
import { createProgressTracker, toPercent } from '@/lib/ProgressUtils'

import { uploadFileInParts } from './MultipartUpload'

/**
 * Uploads the files one after another. Progress covers the bytes of all of
 * them, and each file is reported as soon as it is stored, so a later failure
 * does not hide the files that already made it.
 */

export async function uploadFiles(
	items: TUploadItem[],
	{ signal, onProgress, onFileUploaded }: TUploadFilesOptions,
) {
	const files = items.map(item => item.file)
	const totalBytes = getTotalSize(files)

	const reportFileProgress = createProgressTracker(files.length, loaded =>
		onProgress(toPercent(loaded, totalBytes)),
	)

	for (const [index, { file, isPublic }] of items.entries()) {
		const uploaded = await uploadFileInParts(file, {
			isPublic,
			signal,
			onProgress: loaded => reportFileProgress(index, loaded),
		})

		reportFileProgress(index, file.size)
		onFileUploaded?.(file, uploaded)
	}
}
