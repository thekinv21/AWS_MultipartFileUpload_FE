import { z } from 'zod'

const selectedFileSchema = z.object({
	id: z.string(),
	file: z.instanceof(File),
	previewUrl: z.string().optional(),
	isPublic: z.boolean(),
})

/**
 * Count, size and type limits are enforced when files are added
 * (`validateIncomingFiles`), so the list here is always within them.
 */

export const fileUploadFormSchema = z.object({
	files: z.array(selectedFileSchema).min(1, 'Add at least one file.'),
})

export type FileUploadFormValues = z.infer<typeof fileUploadFormSchema>
