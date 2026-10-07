'use client'

import { useEffect, useRef } from 'react'

import { type UseFormReturn, useWatch } from 'react-hook-form'

import {
	createSelectedFile,
	releaseSelectedFiles,
	type TSelectedFile,
} from '@/lib/FileUtils'

import type { FileUploadFormValues } from './FileUploadSchema'

export function useSelectedFiles(form: UseFormReturn<FileUploadFormValues>) {
	const files = useWatch({ control: form.control, name: 'files' })

	const filesRef = useRef<TSelectedFile[]>(files)

	useEffect(() => {
		filesRef.current = files
	}, [files])

	useEffect(() => () => releaseSelectedFiles(filesRef.current), [])

	/**
	 * @description Gets the current selected files directly from the form
	 * @returns Current selected files
	 */

	const getFiles = () => form.getValues('files')

	/**
	 * @description Updates the selected files in the form
	 * @param next
	 */

	const setFiles = (next: TSelectedFile[]) => {
		form.setValue('files', next, { shouldDirty: true })
	}

	/**
	 * @description Adds incoming files to the selected file list
	 * @param incoming
	 */

	const addFiles = (incoming: File[]) => {
		setFiles([...getFiles(), ...incoming.map(createSelectedFile)])
	}

	/**
	 * @description Removes selected files that match the given condition
	 * @param shouldRemove
	 */

	const removeFiles = (shouldRemove: (item: TSelectedFile) => boolean) => {
		const current = getFiles()

		releaseSelectedFiles(current.filter(shouldRemove))
		setFiles(current.filter(item => !shouldRemove(item)))
	}

	/**
	 * @description Sets whether a selected file is uploaded as public or private
	 * @param id
	 * @param isPublic
	 */

	const setFileVisibility = (id: string, isPublic: boolean) => {
		setFiles(
			getFiles().map(item => (item.id === id ? { ...item, isPublic } : item)),
		)
	}

	return { files, getFiles, addFiles, removeFiles, setFileVisibility }
}
