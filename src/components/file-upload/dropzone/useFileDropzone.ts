import { useDropzone } from 'react-dropzone'

import { getDropzoneAccept } from '@/lib/FileUtils'

import type { TDropzoneState } from './DropzoneConstants'

const DROPZONE_ACCEPT = getDropzoneAccept()

type TUseFileDropzoneOptions = {
	onFilesAdded: (files: File[]) => void
	disabled: boolean
}

export function useFileDropzone({
	onFilesAdded,
	disabled,
}: TUseFileDropzoneOptions) {
	const { getRootProps, getInputProps, isDragActive, isDragReject, open } =
		useDropzone({
			onDrop: (acceptedFiles, fileRejections) =>
				onFilesAdded([
					...acceptedFiles,
					...fileRejections.map(rejection => rejection.file),
				]),
			accept: DROPZONE_ACCEPT,
			disabled,
			multiple: true,

			/**
			 * The Browse button is the one keyboard control, so the area itself is not
			 * focusable
			 */

			noKeyboard: true,
		})

	const state: TDropzoneState = !isDragActive
		? 'idle'
		: isDragReject
			? 'reject'
			: 'accept'

	return { getRootProps, getInputProps, open, state }
}
