'use client'

import { useEffect, useRef } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'

import { toast } from '@/components/ui/toast'

import { useUpload } from '@/hooks/useUpload'

import { REJECTION_MESSAGES } from '@/constants/UploadMessages'
import {
	createSelectedFile,
	releaseSelectedFiles,
	type TSelectedFile,
	validateIncomingFiles,
} from '@/lib/FileUtils'

import {
	fileUploadFormSchema,
	type FileUploadFormValues,
} from './FileUploadSchema'

export const useFileUploader = () => {
	const form = useForm<FileUploadFormValues>({
		resolver: zodResolver(fileUploadFormSchema),
		defaultValues: { files: [] },
	})

	const files = useWatch({ control: form.control, name: 'files' })

	const filesRef = useRef<TSelectedFile[]>(files)

	useEffect(() => {
		filesRef.current = files
	}, [files])

	useEffect(() => () => releaseSelectedFiles(filesRef.current), [])

	const setFiles = (next: TSelectedFile[]) => {
		form.setValue('files', next, { shouldDirty: true })
	}

	const removeFiles = (shouldRemove: (item: TSelectedFile) => boolean) => {
		const current = form.getValues('files')
		releaseSelectedFiles(current.filter(shouldRemove))
		setFiles(current.filter(item => !shouldRemove(item)))
	}

	const upload = useUpload({
		onFileUploaded: file => removeFiles(item => item.file === file),
	})
	const isUploading: boolean = upload.isPending

	const handleFilesAdded = (incoming: File[]) => {
		const current = form.getValues('files')
		const { accepted, rejections } = validateIncomingFiles(
			current.map(item => item.file),
			incoming,
		)

		rejections.forEach(({ file, reason }) =>
			toast.add({
				type: 'error',
				title: REJECTION_MESSAGES[reason].title,
				description: REJECTION_MESSAGES[reason].description(file.name),
			}),
		)

		if (accepted.length > 0) {
			setFiles([...current, ...accepted.map(createSelectedFile)])
		}
	}

	const handleRemove = (id: string) => removeFiles(item => item.id === id)

	const onSubmit = (values: FileUploadFormValues) => {
		upload.mutate(values.files.map(item => item.file))
	}

	return {
		form,
		onSubmit,
		handleFilesAdded,
		isUploading,
		files,
		upload,
		handleRemove,
	}
}
