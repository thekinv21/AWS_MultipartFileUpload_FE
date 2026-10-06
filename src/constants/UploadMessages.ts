import { formatBytes, type UploadRejectionReason } from '@/lib/FileUtils'

import {
	MAX_FILE_NAME_LENGTH,
	MAX_FILE_SIZE_BYTES,
	MAX_FILES_PER_REQUEST,
} from './FileConstant'

const TOAST_NAME_MAX_LENGTH: number = 40

function shortName(name: string) {
	return name.length > TOAST_NAME_MAX_LENGTH
		? `${name.slice(0, TOAST_NAME_MAX_LENGTH - 1)}…`
		: name
}

function pluralizeFiles(count: number) {
	return `${count} ${count === 1 ? 'file' : 'files'}`
}

type TRejectionMessage = {
	title: string
	description: (name: string) => string
}

export const REJECTION_MESSAGES: Record<
	UploadRejectionReason,
	TRejectionMessage
> = {
	duplicate: {
		title: 'Duplicate file',
		description: (name: string) =>
			`"${shortName(name)}" is already in the list.`,
	},
	nameTooLong: {
		title: 'File name too long',
		description: (name: string) =>
			`"${shortName(name)}" has a name longer than ${MAX_FILE_NAME_LENGTH} characters.`,
	},
	typeNotAllowed: {
		title: 'File type not allowed',
		description: (name: string) =>
			`"${shortName(name)}" is not an allowed file type.`,
	},
	fileTooLarge: {
		title: 'File too large',
		description: (name: string) =>
			`"${shortName(name)}" is larger than ${formatBytes(MAX_FILE_SIZE_BYTES)}.`,
	},
	tooManyFiles: {
		title: 'Too many files',
		description: (name: string) =>
			`"${shortName(name)}" was not added: you can upload up to ${MAX_FILES_PER_REQUEST} files.`,
	},
}

export const UPLOAD_MESSAGES = {
	uploadSuccess: {
		title: 'Completed',
		description: (count: number) =>
			`${pluralizeFiles(count)} uploaded successfully.`,
	},
	uploadFailed: {
		title: 'Failed',
		fallback: 'Something went wrong. Please try again.',
	},
	uploadCancelled: {
		title: 'Cancelled',
	},
	uploadPartial: {
		description: (uploaded: number, total: number) =>
			`${uploaded} of ${total} files were uploaded before it stopped.`,
	},
} as const
