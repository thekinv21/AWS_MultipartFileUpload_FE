import type { z } from 'zod'

import type { envSchema } from '@/config/EnvSchema'

export type TEnv = z.infer<typeof envSchema>
