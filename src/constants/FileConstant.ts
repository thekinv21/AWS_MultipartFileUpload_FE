import { env } from '@/config'

export const MAX_FILE_SIZE_BYTES: number = env.NEXT_PUBLIC_FILE_MAX_SIZE_BYTES

export const MAX_FILES_PER_REQUEST: number = env.NEXT_PUBLIC_FILE_MAX_COUNT

export const MAX_FILE_NAME_LENGTH: number = env.NEXT_PUBLIC_FILE_MAX_NAME_LENGTH

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
