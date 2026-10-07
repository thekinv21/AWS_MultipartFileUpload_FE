'use client'

import { IconCloudUpload } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Progress,
	ProgressLabel,
	ProgressValue,
} from '@/components/ui/progress'

import { AllowedFilesHint } from './AllowedFilesHint'
import { FileDropzone } from './FileDropzone'
import { FileList } from './FileList'
import { useFileUploader } from './useFileUploader'

export function FileUploader() {
	const {
		form,
		onSubmit,
		handleFilesAdded,
		isUploading,
		files,
		upload,
		handleRemove,
		handleVisibilityChange,
	} = useFileUploader()

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} noValidate>
			<Card>
				<CardHeader>
					<CardTitle className='text-lg'>React Dropzone</CardTitle>
					<CardDescription>
						Add your files, check the list, then upload them in one go.
					</CardDescription>
				</CardHeader>

				<CardContent className='flex flex-col gap-4'>
					<FileDropzone onFilesAdded={handleFilesAdded} disabled={isUploading}>
						<AllowedFilesHint files={files.map(item => item.file)} />
					</FileDropzone>

					<FileList
						files={files}
						onRemove={handleRemove}
						onVisibilityChange={handleVisibilityChange}
						disabled={isUploading}
					/>
				</CardContent>

				<CardFooter className='flex-col items-stretch gap-3'>
					{isUploading && (
						<Progress value={upload.progress}>
							<ProgressLabel>Uploading</ProgressLabel>
							<ProgressValue />
						</Progress>
					)}

					<div className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
						{isUploading && (
							<Button type='button' variant='outline' onClick={upload.cancel}>
								Cancel
							</Button>
						)}
						<Button
							type='submit'
							size='lg'
							variant='outline'
							disabled={files.length === 0 || isUploading}
							focusableWhenDisabled
							className='px-4 cursor-pointer'
						>
							<IconCloudUpload size={19} stroke={1.8} />
							{isUploading ? 'Uploading…' : 'Upload'}
						</Button>
					</div>
				</CardFooter>
			</Card>
		</form>
	)
}
