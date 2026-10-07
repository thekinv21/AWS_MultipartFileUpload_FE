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

/**
 * @description Gets the file extension from the file name
 * @param name
 * @returns File extension without the dot
 */

export function getFileExtension(name: string) {
	const dotIndex = name.lastIndexOf('.')

	return dotIndex > 0 ? name.slice(dotIndex + 1).toLowerCase() : ''
}

/**
 * @description Creates a unique key for the given file
 * @param file
 * @returns Unique file key
 */

export function getFileKey(file: File) {
	return `${file.name}:${file.size}:${file.lastModified}`
}

/**
 * @description Checks whether the given extension belongs to an image file
 * @param extension
 * @returns True if the extension is an image extension
 */

export function isImageExtension(extension: string) {
	return IMAGE_EXTENSIONS.has(extension)
}

/**
 * @description Formats a byte value into a readable file size
 * @param bytes
 * @returns Formatted file size
 */

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

/**
 * @description Calculates the total size of the given files
 * @param files
 * @returns Total file size in bytes
 */

export function getTotalSize(files: File[]) {
	return files.reduce((total, file) => total + file.size, 0)
}

/**
 * @description Splits a file into chunks with the given chunk size
 * @param file
 * @param chunkSize
 * @returns File chunks
 */

export function splitIntoChunks(file: File, chunkSize: number) {
	const chunks: Blob[] = []

	for (let start = 0; start < file.size; start += chunkSize) {
		chunks.push(file.slice(start, start + chunkSize))
	}

	return chunks.length > 0 ? chunks : [file]
}

/**
 * @description Gets the MIME type of a file without parameters
 * @param file
 * @returns Normalized MIME type
 */

export function getMimeType(file: File) {
	return file.type.split(';')[0].trim().toLowerCase()
}

/**
 * @description Checks whether the file extension and MIME type are allowed
 * @param file
 * @returns True if the file type is allowed
 */

function isAllowedType(file: File) {
	const extension = getFileExtension(file.name)

	if (!Object.hasOwn(ALLOWED_FILE_TYPES, extension)) return false

	return ALLOWED_FILE_TYPES[extension].includes(getMimeType(file))
}

/**
 * @description Creates the accept map for react-dropzone
 * @returns React Dropzone accept configuration
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
 * @description Validates incoming files against upload rules
 * @param current
 * @param incoming
 * @returns Accepted files and rejected files with their rejection reasons
 */

export function validateIncomingFiles(current: File[], incoming: File[]) {
	const accepted: File[] = []
	const rejections: TFileRejection[] = []

	const seenKeys = new Set(current.map(getFileKey))
	let count = current.length

	for (const file of incoming) {
		const reject = (reason: UploadRejectionReason) => {
			rejections.push({ file, reason })
		}

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

/**
 * @description Creates a selected file object with an image preview URL
 * @param file
 * @returns Selected file with optional preview URL
 */

export function createSelectedFile(file: File): TSelectedFile {
	const previewUrl = isImageExtension(getFileExtension(file.name))
		? URL.createObjectURL(file)
		: undefined

	return {
		id: crypto.randomUUID(),
		file,
		previewUrl,
	}
}

/**
 * @description Releases object URLs created for selected files
 * @param files
 */

export function releaseSelectedFiles(files: TSelectedFile[]) {
	for (const { previewUrl } of files) {
		if (previewUrl) URL.revokeObjectURL(previewUrl)
	}
}
