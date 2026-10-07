import { Button } from '@/components/ui/button'

type TDropzoneBrowseButtonProps = {
	onOpen: () => void
	compact: boolean
	disabled: boolean
	describedById: string
}

export function DropzoneBrowseButton(props: TDropzoneBrowseButtonProps) {
	const { onOpen, compact, disabled, describedById } = props

	return (
		<Button
			type='button'
			variant={compact ? 'outline' : 'default'}
			size='sm'
			disabled={disabled}
			aria-describedby={describedById}
			onClick={event => {
				/**
				 * The root would open the picker too; stop it so it opens once
				 */
				event.stopPropagation()
				onOpen()
			}}
			className='shrink-0 cursor-pointer'
		>
			{compact ? 'Add more' : 'Browse files'}
		</Button>
	)
}
