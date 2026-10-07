import { toast } from '@/components/ui/toast'

import { errorCatch } from '@/services/instance'

import { REJECTION_MESSAGES, UPLOAD_MESSAGES } from '@/constants/UploadMessages'

import type { TFileRejection } from './FileUtils'

/**
 * @description Displays toast notifications for rejected files
 * @param rejections
 */

export function notifyFileRejections(rejections: TFileRejection[]) {
	for (const { file, reason } of rejections) {
		toast.add({
			type: 'error',
			title: REJECTION_MESSAGES[reason].title,
			description: REJECTION_MESSAGES[reason].description(file.name),
		})
	}
}

/**
 * @description Displays a success notification after files are uploaded
 * @param fileCount
 */

export function notifyUploadSucceeded(fileCount: number) {
	toast.add({
		type: 'success',
		title: UPLOAD_MESSAGES.uploadSuccess.title,
		description: UPLOAD_MESSAGES.uploadSuccess.description(fileCount),
	})
}

/**
 * @description Displays an informational notification when an upload is cancelled
 * @param partialNote
 */

export function notifyUploadCancelled(partialNote?: string) {
	toast.add({
		type: 'info',
		title: UPLOAD_MESSAGES.uploadCancelled.title,
		description: partialNote,
	})
}

/**
 * @description Displays an error notification when an upload fails
 * @param error
 * @param partialNote
 */

export function notifyUploadFailed(error: unknown, partialNote?: string) {
	toast.add({
		type: 'error',
		title: UPLOAD_MESSAGES.uploadFailed.title,
		description: [
			errorCatch(error, UPLOAD_MESSAGES.uploadFailed.fallback),
			partialNote,
		]
			.filter(Boolean)
			.join(' '),
	})
}

/**
 * @description Creates a notification note for a partially completed upload
 * @param uploadedCount
 * @param total
 * @returns Partial upload message or undefined
 */

export function getPartialUploadNote(uploadedCount: number, total: number) {
	return uploadedCount > 0
		? UPLOAD_MESSAGES.uploadPartial.description(uploadedCount, total)
		: undefined
}
