import { z } from 'zod'

import type { TEnv } from '@/types/env'

import { envSchema } from './EnvSchema'

/**
 * Next.js inlines NEXT_PUBLIC_* values at build time only when each one is
 * read by its full name, so they are listed one by one instead of passing
 * process.env. A missing or invalid value fails the build.
 */

function validateEnv(): TEnv {
	const result = envSchema.safeParse({
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
		NEXT_PUBLIC_FILE_MAX_SIZE_BYTES:
			process.env.NEXT_PUBLIC_FILE_MAX_SIZE_BYTES,
		NEXT_PUBLIC_FILE_MAX_COUNT: process.env.NEXT_PUBLIC_FILE_MAX_COUNT,
		NEXT_PUBLIC_FILE_MAX_NAME_LENGTH:
			process.env.NEXT_PUBLIC_FILE_MAX_NAME_LENGTH,
	})

	if (!result.success) {
		throw new Error(
			`Invalid environment variables:\n${z.prettifyError(result.error)}`,
		)
	}

	return result.data
}

export const env = validateEnv()
