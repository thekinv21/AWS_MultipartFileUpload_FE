import type { TMultipartUploadTarget } from './UploadRequestTypes'

export type TInitiateMultipartResponse = TMultipartUploadTarget & {
	chunkSize: number
}

export type TGetPartUrlResponse = {
	url: string
}

export type TCompleteMultipartResponse = {
	key: string
	url: string
}
