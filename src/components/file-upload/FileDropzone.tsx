import { type ReactNode, useId } from 'react'

import { Input } from '@/components/ui/input'

import { cn } from '@/lib/utils'

import {
	DropzoneBorder,
	DropzoneBrowseButton,
	DropzoneCompactContent,
	DropzoneDotGrid,
	DropzoneFullContent,
	useFileDropzone,
} from './dropzone'

type TFileDropzoneProps = {
	onFilesAdded: (files: File[]) => void
	disabled?: boolean
	compact?: boolean
	children?: ReactNode
}

export function FileDropzone(props: TFileDropzoneProps) {
	const { onFilesAdded, disabled = false, compact = false, children } = props

	const hintId = useId()

	const { getRootProps, getInputProps, open, state } = useFileDropzone({
		onFilesAdded,
		disabled,
	})

	const Content = compact ? DropzoneCompactContent : DropzoneFullContent

	return (
		<div
			{...getRootProps()}
			className={cn(
				'group/dropzone relative isolate cursor-pointer overflow-hidden rounded-xl bg-muted/30 text-center',
				'transition-colors duration-150 ease-out hover:bg-muted/60',
				state === 'accept' && 'bg-primary/5 hover:bg-primary/5',
				state === 'reject' && 'bg-destructive/5 hover:bg-destructive/5',
				disabled && 'cursor-not-allowed opacity-50 hover:bg-muted/30',
			)}
		>
			<Input {...getInputProps()} />

			<DropzoneBorder state={state} />
			<DropzoneDotGrid visible={state !== 'idle'} />

			<Content
				state={state}
				hintId={hintId}
				browseButton={
					<DropzoneBrowseButton
						onOpen={open}
						compact={compact}
						disabled={disabled}
						describedById={hintId}
					/>
				}
			>
				{children}
			</Content>
		</div>
	)
}
