import type { TMultipartUploadTarget } from './MultipartRequestTypes'
import type { TCompleteMultipartUploadResponse } from './MultipartResponseTypes'

export type TUploadItem = {
	file: File
	isPublic: boolean
}

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
	isPublic: boolean
	signal: AbortSignal
	onProgress: (loadedBytes: number) => void
}

export type TUploadPartsOptions = {
	target: TMultipartUploadTarget
	signal: AbortSignal
	onPartProgress: (partIndex: number, loadedBytes: number) => void
}
