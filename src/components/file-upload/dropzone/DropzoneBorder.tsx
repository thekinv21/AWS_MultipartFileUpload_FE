import { motion, useReducedMotion } from 'framer-motion'

import { cn } from '@/lib/utils'

import type { TDropzoneState } from './DropzoneConstants'

type TDropzoneBorderProps = {
	state: TDropzoneState
}

/**
 * SVG border so the dashes can march while files are dragged over the area
 */

export function DropzoneBorder({ state }: TDropzoneBorderProps) {
	const shouldReduceMotion = useReducedMotion()

	const isMarching = !shouldReduceMotion && state !== 'idle'

	return (
		<svg
			aria-hidden='true'
			className='pointer-events-none absolute inset-0 size-full'
		>
			<motion.rect
				x='1'
				y='1'
				rx='11'
				ry='11'
				fill='none'
				strokeWidth={state === 'idle' ? 1.5 : 2}
				strokeDasharray='8 6'
				strokeLinecap='round'
				style={{ width: 'calc(100% - 2px)', height: 'calc(100% - 2px)' }}
				className={cn(
					'stroke-border transition-[stroke] duration-150',
					'group-hover/dropzone:stroke-foreground/25',
					state === 'accept' &&
						'stroke-primary group-hover/dropzone:stroke-primary',
					state === 'reject' &&
						'stroke-destructive group-hover/dropzone:stroke-destructive',
				)}
				animate={{ strokeDashoffset: isMarching ? [0, -28] : 0 }}
				transition={
					isMarching
						? { duration: 0.8, ease: 'linear', repeat: Infinity }
						: { duration: 0 }
				}
			/>
		</svg>
	)
}
