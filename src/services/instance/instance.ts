import axios from 'axios'

import { env } from '@/config'

export const instance = axios.create({
	baseURL: env.NEXT_PUBLIC_API_URL,
})
