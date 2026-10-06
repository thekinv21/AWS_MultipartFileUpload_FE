import { AnimatePresence } from 'framer-motion'

import type { TSelectedFile } from '@/lib/FileUtils'

import { FileListItem } from './FileListItem'

type TFileListProps = {
	files: TSelectedFile[]
	onRemove: (id: string) => void
	disabled?: boolean
}

export function FileList({ files, onRemove, disabled }: TFileListProps) {
	return (
		<ul aria-label='Selected files'>
			<AnimatePresence initial={false}>
				{files.map(file => (
					<FileListItem
						key={file.id}
						item={file}
						onRemove={onRemove}
						disabled={disabled}
					/>
				))}
			</AnimatePresence>
		</ul>
	)
}
