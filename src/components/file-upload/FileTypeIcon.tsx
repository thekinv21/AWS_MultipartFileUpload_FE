import {
	type Icon,
	IconFile,
	IconFileSpreadsheet,
	IconFileTypeCsv,
	IconFileTypeDoc,
	IconFileTypeDocx,
	IconFileTypePdf,
	IconFileTypeTxt,
	IconFileTypeXls,
	IconPhoto,
} from '@tabler/icons-react'

import { cn } from '@/lib/utils'

const ICON_BY_EXTENSION: Record<string, Icon> = {
	pdf: IconFileTypePdf,
	doc: IconFileTypeDoc,
	docx: IconFileTypeDocx,
	xls: IconFileTypeXls,
	xlsx: IconFileSpreadsheet,
	csv: IconFileTypeCsv,
	txt: IconFileTypeTxt,
	jpg: IconPhoto,
	jpeg: IconPhoto,
	png: IconPhoto,
	webp: IconPhoto,
	gif: IconPhoto,
	bmp: IconPhoto,
	ico: IconPhoto,
}

interface FileTypeIconProps {
	extension: string
	className?: string
}

export function FileTypeIcon({ extension, className }: FileTypeIconProps) {
	const IconComponent = ICON_BY_EXTENSION[extension] ?? IconFile

	return (
		<IconComponent
			aria-hidden='true'
			stroke={1.5}
			className={cn('size-5', className)}
		/>
	)
}
