import { cn } from '@/lib/utils'

import { DROPZONE_MESSAGES, type TDropzoneState } from './DropzoneConstants'

type TDropzoneMessageProps = {
	state: TDropzoneState
	className?: string
}

export function DropzoneMessage({ state, className }: TDropzoneMessageProps) {
	return (
		<p
			className={cn(
				'text-sm font-medium',
				state === 'reject' && 'text-destructive',
				className,
			)}
		>
			{DROPZONE_MESSAGES[state]}
		</p>
	)
}
