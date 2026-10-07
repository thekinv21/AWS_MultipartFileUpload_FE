import type { TMultipartUploadTarget } from './FileRequestTypes'

export type TInitiateMultipartUploadResponse = TMultipartUploadTarget & {
	chunkSize: number
}

export type TGetPresignedPartUrlResponse = {
	url: string
}

export type TCompleteMultipartUploadResponse = {
	key: string
}
