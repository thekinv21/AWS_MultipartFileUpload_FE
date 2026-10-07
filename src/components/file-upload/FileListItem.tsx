import Image from 'next/image'

import { IconLock, IconTrash, IconWorld } from '@tabler/icons-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

import {
	formatBytes,
	getFileExtension,
	type TSelectedFile,
} from '@/lib/FileUtils'
import { cn } from '@/lib/utils'

import { FileTypeIcon } from './FileTypeIcon'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

type TFileListItemProps = {
	item: TSelectedFile
	onRemove: (id: string) => void
	onVisibilityChange: (id: string, isPublic: boolean) => void
	disabled?: boolean
}

export function FileListItem(props: TFileListItemProps) {
	const { item, onRemove, onVisibilityChange, disabled } = props

	const shouldReduceMotion = useReducedMotion()

	const { file, previewUrl, isPublic } = item

	const extension: string = getFileExtension(file.name)

	const VisibilityIcon = isPublic ? IconWorld : IconLock

	return (
		<motion.li
			initial={{ opacity: 0, height: 0 }}
			animate={{ opacity: 1, height: 'auto' }}
			exit={{ opacity: 0, height: 0 }}
			transition={{ duration: shouldReduceMotion ? 0 : 0.18, ease: EASE_OUT }}
			className='overflow-hidden'
		>
			<div className='pb-2'>
				<div className='flex items-center gap-3 rounded-lg border bg-background p-2 pr-1.5'>
					<div className='flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-muted-foreground'>
						{previewUrl ? (
							<Image
								src={previewUrl}
								alt=''
								width={40}
								height={40}
								unoptimized
								className='size-10 object-cover'
							/>
						) : (
							<FileTypeIcon extension={extension} />
						)}
					</div>

					<div className='min-w-0 flex-1'>
						<p className='truncate text-sm font-medium' title={file.name}>
							{file.name}
						</p>
						<p className='text-xs text-muted-foreground tabular-nums'>
							{formatBytes(file.size)}, {extension.toUpperCase()}
						</p>
					</div>

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
							onCheckedChange={checked => onVisibilityChange(item.id, checked)}
							aria-label={`Make ${file.name} public`}
						/>
					</Label>

					<Button
						type='button'
						variant='ghost'
						size='icon'
						aria-label={`Remove ${file.name}`}
						disabled={disabled}
						onClick={() => onRemove(item.id)}
						className='text-muted-foreground hover:text-destructive'
					>
						<IconTrash aria-hidden='true' />
					</Button>
				</div>
			</div>
		</motion.li>
	)
}
