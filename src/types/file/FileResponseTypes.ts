import type { TMultipartUploadTarget } from './FileRequestTypes'

export type TInitiateMultipartUploadResponse = TMultipartUploadTarget & {
	chunkSize: number
	isPublic: boolean
}

export type TGetPresignedPartUrlResponse = {
	url: string
}

export type TCompleteMultipartUploadResponse = {
	name: string
	size: number
	key: string
	/**
	 * Permanent URL for public files; private files are downloaded through
	 * a presigned URL from download-url instead
	 */
	url: string | null
	isPublic: boolean
}

export type TGetDownloadUrlResponse = {
	url: string
}
