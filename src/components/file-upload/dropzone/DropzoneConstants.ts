import {
	type Icon,
	IconFileSpreadsheet,
	IconFileTypePdf,
	IconPhoto,
} from '@tabler/icons-react'

export type TDropzoneState = 'idle' | 'accept' | 'reject'

type TCardPose = { x: number; y: number; rotate: number }

export type TPreviewCard = {
	icon: Icon
	idle: TCardPose
	active: TCardPose
}

export const DROPZONE_MESSAGES: Record<TDropzoneState, string> = {
	idle: 'Drag and drop files here',
	accept: 'Release to add files',
	reject: 'Some of these files are not supported',
}

export const CARD_SPRING = {
	type: 'spring',
	stiffness: 380,
	damping: 26,
} as const

/**
 * Decorative cards that sit behind the cloud and fan out while dragging
 */

export const PREVIEW_CARDS: TPreviewCard[] = [
	{
		icon: IconFileTypePdf,
		idle: { x: -14, y: 4, rotate: -10 },
		active: { x: -40, y: -6, rotate: -18 },
	},
	{
		icon: IconPhoto,
		idle: { x: 0, y: -4, rotate: 0 },
		active: { x: 0, y: -22, rotate: 0 },
	},
	{
		icon: IconFileSpreadsheet,
		idle: { x: 14, y: 4, rotate: 10 },
		active: { x: 40, y: -6, rotate: 18 },
	},
]
