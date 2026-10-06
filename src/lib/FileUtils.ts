import {
	ALLOWED_FILE_TYPES,
	MAX_FILE_NAME_LENGTH,
	MAX_FILE_SIZE_BYTES,
	MAX_FILES_PER_REQUEST,
} from '@/constants/FileConstant'

const IMAGE_EXTENSIONS = new Set([
	'jpg',
	'jpeg',
	'png',
	'webp',
	'gif',
	'bmp',
	'ico',
])

const BYTE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const

export type UploadRejectionReason =
	| 'nameTooLong'
	| 'typeNotAllowed'
	| 'fileTooLarge'
	| 'duplicate'
	| 'tooManyFiles'

export type TSelectedFile = {
	id: string
	file: File
	previewUrl?: string
}

export type TFileRejection = {
	file: File
	reason: UploadRejectionReason
}

export function getFileExtension(name: string) {
	const dotIndex = name.lastIndexOf('.')
	return dotIndex > 0 ? name.slice(dotIndex + 1).toLowerCase() : ''
}

export function getFileKey(file: File) {
	return `${file.name}:${file.size}:${file.lastModified}`
}

export function isImageExtension(extension: string) {
	return IMAGE_EXTENSIONS.has(extension)
}

export function formatBytes(bytes: number) {
	let value = bytes
	let unitIndex = 0

	while (value >= 1024 && unitIndex < BYTE_UNITS.length - 1) {
		value /= 1024
		unitIndex++
	}

	const rounded = unitIndex === 0 ? value : Math.round(value * 10) / 10
	return `${rounded} ${BYTE_UNITS[unitIndex]}`
}

export function getTotalSize(files: File[]) {
	return files.reduce((total, file) => total + file.size, 0)
}

/**
 * Splits a file into `chunkSize` slices; an empty file stays one empty slice
 */

export function splitIntoChunks(file: File, chunkSize: number) {
	const chunks: Blob[] = []

	for (let start = 0; start < file.size; start += chunkSize) {
		chunks.push(file.slice(start, start + chunkSize))
	}

	return chunks.length > 0 ? chunks : [file]
}

/**
 * The MIME type sent to the backend as `contentType`, without parameters
 */

export function getMimeType(file: File) {
	return file.type.split(';')[0].trim().toLowerCase()
}

function isAllowedType(file: File) {
	const extension = getFileExtension(file.name)
	if (!Object.hasOwn(ALLOWED_FILE_TYPES, extension)) return false

	/**
	 * The backend checks the exact MIME type against the extension, so both
	 * sides must agree on the type
	 */
	return ALLOWED_FILE_TYPES[extension].includes(getMimeType(file))
}

/**
 * The `accept` map for react-dropzone, so the file picker only offers allowed
 * types.
 */

export function getDropzoneAccept() {
	const accept: Record<string, string[]> = {}

	for (const [extension, mimeTypes] of Object.entries(ALLOWED_FILE_TYPES)) {
		for (const mimeType of mimeTypes) {
			accept[mimeType] = [...(accept[mimeType] ?? []), `.${extension}`]
		}
	}

	return accept
}

/**
 * The only validator for incoming files. Rules run per file in a fixed order
 * and the first failure wins: name length, type, size, duplicate, count.
 */

export function validateIncomingFiles(current: File[], incoming: File[]) {
	const accepted: File[] = []
	const rejections: TFileRejection[] = []

	const seenKeys = new Set(current.map(getFileKey))
	let count = current.length

	for (const file of incoming) {
		const reject = (reason: UploadRejectionReason) =>
			rejections.push({ file, reason })

		if (file.name.length > MAX_FILE_NAME_LENGTH) {
			reject('nameTooLong')
			continue
		}

		if (!isAllowedType(file)) {
			reject('typeNotAllowed')
			continue
		}

		if (file.size > MAX_FILE_SIZE_BYTES) {
			reject('fileTooLarge')
			continue
		}

		const key = getFileKey(file)
		if (seenKeys.has(key)) {
			reject('duplicate')
			continue
		}

		if (count >= MAX_FILES_PER_REQUEST) {
			reject('tooManyFiles')
			continue
		}

		seenKeys.add(key)
		count++
		accepted.push(file)
	}

	return { accepted, rejections }
}

export function createSelectedFile(file: File): TSelectedFile {
	const previewUrl = isImageExtension(getFileExtension(file.name))
		? URL.createObjectURL(file)
		: undefined

	return { id: crypto.randomUUID(), file, previewUrl }
}

export function releaseSelectedFiles(files: TSelectedFile[]) {
	for (const { previewUrl } of files) {
		if (previewUrl) URL.revokeObjectURL(previewUrl)
	}
}

export function toPercent(loaded: number, total: number) {
	return total > 0 ? Math.round((loaded / total) * 100) : 0
}
