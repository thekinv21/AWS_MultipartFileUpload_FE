import { type ReactNode, useId } from 'react'

import { IconCloudUpload } from '@tabler/icons-react'
import { useDropzone } from 'react-dropzone'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { getDropzoneAccept } from '@/lib/FileUtils'
import { cn } from '@/lib/utils'

const DROPZONE_ACCEPT = getDropzoneAccept()

type TFileDropzoneProps = {
	onFilesAdded: (files: File[]) => void
	disabled?: boolean
	children?: ReactNode
}

export function FileDropzone(props: TFileDropzoneProps) {
	const { onFilesAdded, disabled = false, children } = props

	const hintId = useId()

	const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
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

	return (
		<div
			{...getRootProps()}
			className={cn(
				'flex cursor-pointer flex-col items-center gap-4 rounded-xl border-2 border-dashed border-border bg-muted/30 px-4 py-8 text-center',
				'transition-[border-color,background-color] duration-150 ease-out',
				'hover:border-foreground/25 hover:bg-muted/60',
				isDragActive && 'border-primary bg-primary/5 hover:border-primary',
				disabled && 'cursor-not-allowed opacity-50 hover:border-border',
			)}
		>
			<Input {...getInputProps()} />

			<div
				className={cn(
					'flex size-12 items-center justify-center rounded-full bg-background text-muted-foreground shadow-xs ring-1 ring-foreground/10',
					'transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none',
					isDragActive && 'scale-110 text-foreground',
				)}
			>
				<IconCloudUpload aria-hidden='true' stroke={1.5} className='size-6' />
			</div>

			<div className='flex flex-col items-center gap-1'>
				<p className='text-sm font-medium'>
					{isDragActive
						? 'Drop files here'
						: 'Drag and drop files here, or browse'}
				</p>
				<Button
					type='button'
					variant='outline'
					size='sm'
					disabled={disabled}
					aria-describedby={hintId}
					onClick={event => {
						/**
						 * The root would open the picker too; stop it so it opens once
						 */
						event.stopPropagation()
						open()
					}}
					className='mt-2'
				>
					Browse files
				</Button>
			</div>

			<div id={hintId}>{children}</div>
		</div>
	)
}
