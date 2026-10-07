import { motion, useReducedMotion } from 'framer-motion'

import { cn } from '@/lib/utils'

import {
	CARD_SPRING,
	PREVIEW_CARDS,
	type TDropzoneState,
} from './DropzoneConstants'
import { DropzoneIcon } from './DropzoneIcon'

type TDropzonePreviewCardsProps = {
	state: TDropzoneState
}

export function DropzonePreviewCards({ state }: TDropzonePreviewCardsProps) {
	const shouldReduceMotion = useReducedMotion()

	const isFannedOut = state === 'accept' && !shouldReduceMotion

	return (
		<div className='relative flex h-20 w-32 items-end justify-center'>
			{PREVIEW_CARDS.map(({ icon: CardIcon, idle, active }, index) => (
				<motion.div
					key={index}
					aria-hidden='true'
					initial={false}
					animate={isFannedOut ? active : idle}
					transition={CARD_SPRING}
					className={cn(
						'absolute bottom-3 flex h-14 w-11 items-start justify-center rounded-md bg-background pt-2 text-muted-foreground shadow-sm ring-1 ring-foreground/10',
						'transition-opacity duration-200',
						state === 'reject' && 'opacity-40',
					)}
					style={{ zIndex: index === 1 ? 1 : 0 }}
				>
					<CardIcon stroke={1.5} className='size-5' />
				</motion.div>
			))}

			<div className='relative z-10'>
				<DropzoneIcon state={state} size='lg' />
			</div>
		</div>
	)
}
