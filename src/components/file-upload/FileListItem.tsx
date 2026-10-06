import Image from 'next/image'

import { IconTrash } from '@tabler/icons-react'
import { motion, useReducedMotion } from 'framer-motion'

import { Button } from '@/components/ui/button'

import {
	formatBytes,
	getFileExtension,
	type TSelectedFile,
} from '@/lib/FileUtils'

import { FileTypeIcon } from './FileTypeIcon'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

type TFileListItemProps = {
	item: TSelectedFile
	onRemove: (id: string) => void
	disabled?: boolean
}

export function FileListItem({ item, onRemove, disabled }: TFileListItemProps) {
	const shouldReduceMotion = useReducedMotion()
	const { file, previewUrl } = item
	const extension = getFileExtension(file.name)

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
