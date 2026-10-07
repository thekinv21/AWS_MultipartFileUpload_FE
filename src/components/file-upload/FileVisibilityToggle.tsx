import { IconLock, IconWorld } from '@tabler/icons-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

import { cn } from '@/lib/utils'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

type TFileVisibilityToggleProps = {
	fileName: string
	isPublic: boolean
	onChange: (isPublic: boolean) => void
	disabled?: boolean
}

export function FileVisibilityToggle(props: TFileVisibilityToggleProps) {
	const { fileName, isPublic, onChange, disabled } = props

	const shouldReduceMotion = useReducedMotion()

	const VisibilityIcon = isPublic ? IconWorld : IconLock

	return (
		<Label
			title={
				isPublic
					? 'Anyone with the link can view this file'
					: 'Only you can view this file'
			}
			className={cn(
				'shrink-0 cursor-pointer gap-1.5 rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted',
				isPublic && 'text-foreground',
				disabled && 'pointer-events-none opacity-50',
			)}
		>
			<span className='relative flex size-4 items-center justify-center'>
				<AnimatePresence initial={false} mode='popLayout'>
					<motion.span
						key={isPublic ? 'public' : 'private'}
						initial={{ opacity: 0, scale: 0.6 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.6 }}
						transition={{
							duration: shouldReduceMotion ? 0 : 0.15,
							ease: EASE_OUT,
						}}
						className='flex'
					>
						<VisibilityIcon size={16} stroke={1.8} aria-hidden='true' />
					</motion.span>
				</AnimatePresence>
			</span>

			<span
				className='hidden grid-cols-1 grid-rows-1 sm:grid'
				aria-hidden='true'
			>
				<span className='invisible col-start-1 row-start-1'>Private</span>
				<span className='col-start-1 row-start-1'>
					{isPublic ? 'Public' : 'Private'}
				</span>
			</span>

			<Switch
				size='sm'
				checked={isPublic}
				disabled={disabled}
				onCheckedChange={onChange}
				aria-label={`Make ${fileName} public`}
			/>
		</Label>
	)
}
