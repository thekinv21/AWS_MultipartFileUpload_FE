import { cn } from '@/lib/utils'

type TDropzoneDotGridProps = {
	visible: boolean
}

/**
 * Dot grid that fades in while files are dragged over the area
 */

export function DropzoneDotGrid({ visible }: TDropzoneDotGridProps) {
	return (
		<div
			aria-hidden='true'
			className={cn(
				'pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-200',
				'bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] bg-size-[14px_14px]',
				'mask-[radial-gradient(ellipse_at_center,black_30%,transparent_75%)]',
				visible && 'opacity-100',
			)}
		/>
	)
}
