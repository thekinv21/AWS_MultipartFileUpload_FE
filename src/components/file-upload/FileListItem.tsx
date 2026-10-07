import { IconTrash } from '@tabler/icons-react'
import { motion, useReducedMotion } from 'framer-motion'

import { Button } from '@/components/ui/button'

import {
	formatBytes,
	getFileExtension,
	type TSelectedFile,
} from '@/lib/FileUtils'

import { FileThumbnail } from './FileThumbnail'
import { FileVisibilityToggle } from './FileVisibilityToggle'

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
					<FileThumbnail extension={extension} previewUrl={previewUrl} />

					<div className='min-w-0 flex-1'>
						<p className='truncate text-sm font-medium' title={file.name}>
							{file.name}
						</p>
						<p className='text-xs text-muted-foreground tabular-nums'>
							{formatBytes(file.size)}, {extension.toUpperCase()}
						</p>
					</div>

					<FileVisibilityToggle
						fileName={file.name}
						isPublic={isPublic}
						onChange={checked => onVisibilityChange(item.id, checked)}
						disabled={disabled}
					/>

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
