import type { ReactNode } from 'react'

import type { TDropzoneState } from './DropzoneConstants'
import { DropzoneIcon } from './DropzoneIcon'
import { DropzoneMessage } from './DropzoneMessage'
import { DropzonePreviewCards } from './DropzonePreviewCards'

type TDropzoneContentProps = {
	state: TDropzoneState
	hintId: string
	browseButton: ReactNode
	children?: ReactNode
}

export function DropzoneFullContent(props: TDropzoneContentProps) {
	const { state, hintId, browseButton, children } = props

	return (
		<div className='flex flex-col items-center gap-5 px-4 pt-10 pb-8'>
			<DropzonePreviewCards state={state} />

			<div className='flex flex-col items-center gap-1.5'>
				<DropzoneMessage state={state} />
				<p className='text-xs text-muted-foreground'>
					or pick them from your device
				</p>
			</div>

			{browseButton}

			<div id={hintId}>{children}</div>
		</div>
	)
}

export function DropzoneCompactContent(props: TDropzoneContentProps) {
	const { state, hintId, browseButton, children } = props

	return (
		<div className='flex items-center gap-3 px-4 py-3 text-left'>
			<DropzoneIcon state={state} size='sm' />

			<div className='flex min-w-0 flex-1 flex-col gap-0.5'>
				<DropzoneMessage state={state} className='truncate' />
				<div id={hintId}>{children}</div>
			</div>

			{browseButton}
		</div>
	)
}
