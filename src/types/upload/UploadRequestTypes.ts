export type TMultipartUploadTarget = {
	key: string
	uploadId: string
}

export type TCompletedPart = {
	PartNumber: number
	ETag: string
}

export type TInitiateMultipartRequest = {
	fileName: string
	contentType: string
}

export type TGetPartUrlRequest = TMultipartUploadTarget & {
	partNumber: number
}

export type TCompleteMultipartRequest = TMultipartUploadTarget & {
	parts: TCompletedPart[]
}

export type TAbortMultipartRequest = TMultipartUploadTarget

export type TUploadFileInPartsOptions = {
	signal: AbortSignal
	onProgress: (loadedBytes: number) => void
}
