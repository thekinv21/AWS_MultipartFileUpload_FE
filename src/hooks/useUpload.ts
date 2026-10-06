import { useCallback, useEffect, useRef, useState } from 'react'

import { useMutation } from '@tanstack/react-query'
import axios, { type AxiosProgressEvent, type AxiosRequestConfig } from 'axios'

import { toast } from '@/components/ui/toast'

import { awsService } from '@/services/aws'
import { errorCatch } from '@/services/instance'

import { UPLOAD_MESSAGES } from '@/constants/UploadMessages'

const SINGLE_FILE_FIELD: string = 'file'
const MULTI_FILE_FIELD: string = 'files'

export function useUpload() {
	const [progress, setProgress] = useState<number>(0)
	const controllerRef = useRef<AbortController | null>(null)
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
			setProgress(0)

			const config: AxiosRequestConfig = {
				signal: controller.signal,
				onUploadProgress: ({ loaded, total }: AxiosProgressEvent) =>
					setProgress(total ? Math.round((loaded / total) * 100) : 0),
			}

			const isSingle = files.length === 1
			const formData = new FormData()
			files.forEach(file =>
				formData.append(isSingle ? SINGLE_FILE_FIELD : MULTI_FILE_FIELD, file),
			)

			return isSingle
				? awsService.singleUpload(formData, config)
				: awsService.multiUpload(formData, config)
		},
		onSuccess: (_data, files) => {
			toast.add({
				type: 'success',
				title: UPLOAD_MESSAGES.uploadSuccess.title,
				description: UPLOAD_MESSAGES.uploadSuccess.description(files.length),
			})
		},
		onError: error => {
			if (axios.isCancel(error)) {
				/**
				 * Leaving the page is not a user cancel, so stay quiet
				 */

				if (isMountedRef.current) {
					toast.add({
						type: 'info',
						title: UPLOAD_MESSAGES.uploadCancelled.title,
					})
				}
				return
			}

			toast.add({
				type: 'error',
				title: UPLOAD_MESSAGES.uploadFailed.title,
				description: errorCatch(error, UPLOAD_MESSAGES.uploadFailed.fallback),
			})
		},
		onSettled: () => {
			controllerRef.current = null
		},
	})

	const cancel = useCallback(() => controllerRef.current?.abort(), [])

	return { ...mutation, progress, cancel }
}
