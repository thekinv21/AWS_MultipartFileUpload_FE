import type { TMultipartUploadTarget } from './MultipartRequestTypes'

export type TInitiateMultipartUploadResponse = TMultipartUploadTarget & {
	chunkSize: number
	isPublic: boolean
}

export type TGetPresignedPartUrlResponse = {
	url: string
}

export type TCompleteMultipartUploadResponse = {
	key: string
	name: string
	/**
	 * Lowercase, without the dot, e.g. "pdf"
	 */
	extension: string
	size: number
	isPublic: boolean
	/**
	 * Permanent URL for public files; private files are downloaded through
	 * a presigned URL from download-url instead
	 */
	url: string | null
}

export type TGetDownloadUrlResponse = {
	url: string
}
