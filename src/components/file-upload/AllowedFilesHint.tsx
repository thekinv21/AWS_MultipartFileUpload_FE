import { Badge } from '@/components/ui/badge'

import {
	ALLOWED_FILE_TYPES,
	MAX_FILE_SIZE_BYTES,
	MAX_FILES_PER_REQUEST,
	MAX_TOTAL_UPLOAD_SIZE_BYTES,
} from '@/constants/FileConstant'
import { formatBytes, getTotalSize } from '@/lib/FileUtils'

const ALLOWED_EXTENSIONS: string[] = Object.keys(ALLOWED_FILE_TYPES).map(
	extension => extension.toUpperCase(),
)

type TAllowedFilesHintProps = {
	files: File[]
}

export function AllowedFilesHint({ files }: TAllowedFilesHintProps) {
	if (files.length > 0) {
		return (
			<p className='text-xs text-muted-foreground tabular-nums'>
				{files.length} of {MAX_FILES_PER_REQUEST} files,{' '}
				{formatBytes(getTotalSize(files))} of{' '}
				{formatBytes(MAX_TOTAL_UPLOAD_SIZE_BYTES)}
			</p>
		)
	}

	return (
		<div className='flex flex-col items-center gap-3'>
			<ul
				aria-label='Allowed file types'
				className='flex max-w-sm flex-wrap justify-center gap-1.5'
			>
				{ALLOWED_EXTENSIONS.map((ex: string) => (
					<li key={ex}>
						<Badge variant='outline' className='font-mono text-[0.7rem]'>
							{ex}
						</Badge>
					</li>
				))}
			</ul>
			<p className='text-xs text-muted-foreground'>
				Up to {formatBytes(MAX_FILE_SIZE_BYTES)} per file,{' '}
				{MAX_FILES_PER_REQUEST} files max,{' '}
				{formatBytes(MAX_TOTAL_UPLOAD_SIZE_BYTES)} in total
			</p>
		</div>
	)
}
