import axios from 'axios'

export function errorCatch(error: unknown): string {
	if (axios.isAxiosError(error)) {
		const message = error.response?.data?.message
		if (Array.isArray(message) && message.length > 0) return message.join(', ')
		if (typeof message === 'string' && message) return message
	}
	return 'Something went wrong'
}
