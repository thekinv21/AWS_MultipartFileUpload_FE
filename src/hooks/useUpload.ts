import { useCallback, useEffect, useRef, useState } from 'react'

import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

import { toast } from '@/components/ui/toast'

import { uploadFileInParts } from '@/services/file'
import { errorCatch } from '@/services/instance'

import type { TCompleteMultipartUploadResponse } from '@/types/file'

import { UPLOAD_MESSAGES } from '@/constants/UploadMessages'
import { getTotalSize, toPercent } from '@/lib/FileUtils'

type TUseUploadOptions = {
	/**
	 * Called as soon as a file is stored, with its S3 key
	 */
	onFileUploaded?: (
		file: File,
		uploaded: TCompleteMultipartUploadResponse,
	) => void
}

export function useUpload({ onFileUploaded }: TUseUploadOptions = {}) {
	const [progress, setProgress] = useState<number>(0)
	const controllerRef = useRef<AbortController | null>(null)
	const uploadedCountRef = useRef<number>(0)
	const isMountedRef = useRef<boolean>(true)

	/**
	 * Abort a running upload when the uploader leaves the page
	 */

	useEffect(() => {
		isMountedRef.current = true
		return () => {
			isMountedRef.current = false
			controllerRef.current?.abort()
		}
	}, [])

	const mutation = useMutation({
		mutationKey: ['files', 'upload'],
		mutationFn: async (files: File[]) => {
			const controller = new AbortController()
			controllerRef.current = controller
			uploadedCountRef.current = 0
			setProgress(0)

			/**
			 * Files go one after another; progress covers the bytes of all of them
			 */

			const totalBytes = getTotalSize(files)
			let completedBytes = 0

			for (const file of files) {
				const uploaded = await uploadFileInParts(file, {
					signal: controller.signal,
					onProgress: loadedBytes =>
						setProgress(toPercent(completedBytes + loadedBytes, totalBytes)),
				})

				completedBytes += file.size
				uploadedCountRef.current++
				onFileUploaded?.(file, uploaded)
			}
		},
		onSuccess: (_data, files) => {
			toast.add({
				type: 'success',
				title: UPLOAD_MESSAGES.uploadSuccess.title,
				description: UPLOAD_MESSAGES.uploadSuccess.description(files.length),
			})
		},
		onError: (error, files) => {
			/**
			 * Files stored before the stop are already off the list; say so
			 */

			const uploadedCount = uploadedCountRef.current
			const partialNote =
				uploadedCount > 0
					? UPLOAD_MESSAGES.uploadPartial.description(
							uploadedCount,
							files.length,
						)
					: undefined

			if (axios.isCancel(error)) {
				/**
				 * Leaving the page is not a user cancel, so stay quiet
				 */

				if (isMountedRef.current) {
					toast.add({
						type: 'info',
						title: UPLOAD_MESSAGES.uploadCancelled.title,
						description: partialNote,
					})
				}
				return
			}

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
		},
		onSettled: () => {
			controllerRef.current = null
		},
	})

	const cancel = useCallback(() => controllerRef.current?.abort(), [])

	return { ...mutation, progress, cancel }
}
