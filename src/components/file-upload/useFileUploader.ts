'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { useUpload } from '@/hooks/useUpload'

import { validateIncomingFiles } from '@/lib/FileUtils'
import { notifyFileRejections } from '@/lib/UploadNotifications'

import {
	fileUploadFormSchema,
	type FileUploadFormValues,
} from './FileUploadSchema'
import { useSelectedFiles } from './useSelectedFiles'

export const useFileUploader = () => {
	const form = useForm<FileUploadFormValues>({
		resolver: zodResolver(fileUploadFormSchema),
		defaultValues: { files: [] },
	})

	const { files, getFiles, addFiles, removeFiles, setFileVisibility } =
		useSelectedFiles(form)

	const upload = useUpload({
		onFileUploaded: file => removeFiles(item => item.file === file),
	})

	const isUploading: boolean = upload.isPending

	/**
	 * @description Validates and adds incoming files to the selected file list
	 * @param incoming
	 */

	const handleFilesAdded = (incoming: File[]) => {
		const current = getFiles().map(item => item.file)
		const { accepted, rejections } = validateIncomingFiles(current, incoming)

		notifyFileRejections(rejections)

		if (accepted.length > 0) addFiles(accepted)
	}

	/**
	 * @description Removes a selected file by its identifier
	 * @param id
	 */

	const handleRemove = (id: string) => {
		removeFiles(item => item.id === id)
	}

	/**
	 * @description Changes the public/private visibility of a selected file
	 * @param id
	 * @param isPublic
	 */

	const handleVisibilityChange = (id: string, isPublic: boolean) => {
		setFileVisibility(id, isPublic)
	}

	/**
	 * @description Submits the selected files for upload
	 * @param values
	 */

	const onSubmit = (values: FileUploadFormValues) => {
		upload.mutate(
			values.files.map(item => ({
				file: item.file,
				isPublic: item.isPublic,
			})),
		)
	}

	return {
		form,
		onSubmit,
		handleFilesAdded,
		isUploading,
		files,
		upload,
		handleRemove,
		handleVisibilityChange,
	}
}
