import { IconAlertTriangle, IconCloudUpload } from '@tabler/icons-react'

import { cn } from '@/lib/utils'

import type { TDropzoneState } from './DropzoneConstants'

type TDropzoneIconProps = {
	state: TDropzoneState
	size: 'sm' | 'lg'
}

export function DropzoneIcon({ state, size }: TDropzoneIconProps) {
	const IconComponent = state === 'reject' ? IconAlertTriangle : IconCloudUpload

	return (
		<div
			aria-hidden='true'
			className={cn(
				'flex shrink-0 items-center justify-center rounded-full bg-background text-muted-foreground shadow-xs ring-1 ring-foreground/10',
				'transition-[transform,color,background-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none',
				size === 'lg' ? 'size-11' : 'size-9',
				state === 'accept' &&
					'scale-110 bg-primary text-primary-foreground ring-primary',
				state === 'reject' &&
					'bg-destructive/10 text-destructive ring-destructive/30',
			)}
		>
			<IconComponent
				stroke={1.75}
				className={cn(
					size === 'lg' ? 'size-5' : 'size-4',
					state === 'accept' && 'motion-safe:animate-bounce',
				)}
			/>
		</div>
	)
}
