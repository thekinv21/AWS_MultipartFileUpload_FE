import { FileUploader } from '@/components/file-upload/FileUploader'

export default function Home() {
	return (
		<main className='flex flex-1 items-center justify-center bg-muted/40 px-4 py-10 sm:py-16'>
			<div className='w-full max-w-xl'>
				<FileUploader />
			</div>
		</main>
	)
}
