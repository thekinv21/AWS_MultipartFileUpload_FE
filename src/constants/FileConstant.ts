export const MAX_FILE_SIZE_BYTES: number = 1024 * 1024 * 1024

export const MAX_TOTAL_UPLOAD_SIZE_BYTES: number = 1024 * 1024 * 1024

export const MAX_FILES_PER_REQUEST: number = 10

export const MAX_FILE_NAME_LENGTH: number = 255

export const ALLOWED_FILE_TYPES: Record<string, readonly string[]> = {
	pdf: ['application/pdf'],
	doc: ['application/msword'],
	docx: [
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	],
	txt: ['text/plain'],
	xls: ['application/vnd.ms-excel'],
	xlsx: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
	csv: ['text/csv', 'application/vnd.ms-excel'],
	jpg: ['image/jpeg'],
	jpeg: ['image/jpeg'],
	png: ['image/png'],
	webp: ['image/webp'],
	gif: ['image/gif'],
	bmp: ['image/bmp'],
	ico: ['image/x-icon', 'image/vnd.microsoft.icon'],
}
