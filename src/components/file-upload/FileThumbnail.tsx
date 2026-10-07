import Image from 'next/image'

import { FileTypeIcon } from './FileTypeIcon'

type TFileThumbnailProps = {
	extension: string
	previewUrl?: string
}

export function FileThumbnail({ extension, previewUrl }: TFileThumbnailProps) {
	return (
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
	)
}
