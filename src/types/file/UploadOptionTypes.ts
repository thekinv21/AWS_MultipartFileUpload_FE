import type { TMultipartUploadTarget } from './FileRequestTypes'
import type { TCompleteMultipartUploadResponse } from './FileResponseTypes'

export type TUploadFilesOptions = {
	signal: AbortSignal
	/**
	 * Overall progress of all files, 0–100
	 */
	onProgress: (percent: number) => void
	onFileUploaded?: (
		file: File,
		uploaded: TCompleteMultipartUploadResponse,
	) => void
}

export type TUploadFileInPartsOptions = {
	signal: AbortSignal
	onProgress: (loadedBytes: number) => void
}

export type TUploadPartsOptions = {
	target: TMultipartUploadTarget
	signal: AbortSignal
	onPartProgress: (partIndex: number, loadedBytes: number) => void
}
