import axios from 'axios'

export const DEFAULT_ERROR_MESSAGE: string = 'Something went wrong'

export function errorCatch(
	error: unknown,
	fallback: string = DEFAULT_ERROR_MESSAGE,
): string {
	if (axios.isAxiosError(error)) {
		const message = error.response?.data?.message
		if (Array.isArray(message) && message.length > 0) return message.join(', ')
		if (typeof message === 'string' && message) return message
	}
	return fallback
}
