import { z } from 'zod'

const positiveInt = () => z.coerce.number().int().positive()

export const envSchema = z.object({
	NEXT_PUBLIC_API_URL: z.url(),
	NEXT_PUBLIC_FILE_MAX_SIZE_BYTES: positiveInt(),
	NEXT_PUBLIC_FILE_MAX_COUNT: positiveInt(),
	NEXT_PUBLIC_FILE_MAX_NAME_LENGTH: positiveInt(),
})
