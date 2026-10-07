import { useRef, useState } from 'react'

import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

import type {
	TCompleteMultipartUploadResponse,
	TUploadItem,
} from '@/types/file'

import { uploadFiles } from '@/lib/upload'
import {
	getPartialUploadNote,
	notifyUploadCancelled,
	notifyUploadFailed,
	notifyUploadSucceeded,
} from '@/lib/UploadNotifications'

import { useAbortController } from './useAbortController'

type TUseUploadOptions = {
	onFileUploaded?: (
		file: File,
		uploaded: TCompleteMultipartUploadResponse,
	) => void
}

export function useUpload({ onFileUploaded }: TUseUploadOptions = {}) {
	const [progress, setProgress] = useState<number>(0)
	const uploadedCountRef = useRef<number>(0)
	const abortController = useAbortController()

	const handleFileUploaded = (
		file: File,
		uploaded: TCompleteMultipartUploadResponse,
	) => {
		uploadedCountRef.current++
		onFileUploaded?.(file, uploaded)
	}

	const handleError = (error: unknown, items: TUploadItem[]) => {
		const partialNote = getPartialUploadNote(
			uploadedCountRef.current,
			items.length,
		)

		if (!axios.isCancel(error)) {
			notifyUploadFailed(error, partialNote)
			return
		}

		/**
		 * Leaving the page is not a user cancel, so stay quiet
		 */

		if (abortController.isMounted()) {
			notifyUploadCancelled(partialNote)
		}
	}

	const mutation = useMutation({
		mutationKey: ['files', 'upload'],
		mutationFn: (items: TUploadItem[]) => {
			uploadedCountRef.current = 0
			setProgress(0)

			return uploadFiles(items, {
				signal: abortController.start(),
				onProgress: setProgress,
				onFileUploaded: handleFileUploaded,
			})
		},
		onSuccess: (_data, items) => notifyUploadSucceeded(items.length),
		onError: handleError,
		onSettled: abortController.clear,
	})

	return { ...mutation, progress, cancel: abortController.abort }
}
