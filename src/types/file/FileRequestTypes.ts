export type TMultipartUploadTarget = {
	key: string
	uploadId: string
}

export type TCompletedPart = {
	PartNumber: number
	ETag: string
}

export type TInitiateMultipartUploadRequest = {
	fileName: string
	contentType: string
}

export type TGetPresignedPartUrlRequest = TMultipartUploadTarget & {
	partNumber: number
}

export type TCompleteMultipartUploadRequest = TMultipartUploadTarget & {
	parts: TCompletedPart[]
}

export type TAbortMultipartUploadRequest = TMultipartUploadTarget

export type TUploadFileInPartsOptions = {
	signal: AbortSignal
	onProgress: (loadedBytes: number) => void
}
