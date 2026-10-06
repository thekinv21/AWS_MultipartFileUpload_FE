'use client'

import { type ReactNode, useState } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider as JotaiProvider } from 'jotai'

import { Toaster } from '@/components/ui/toast'

export function Providers({ children }: { children: ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: { staleTime: 60 * 1000, refetchOnWindowFocus: false },
				},
			}),
	)

	return (
		<JotaiProvider>
			<QueryClientProvider client={queryClient}>
				<Toaster />
				{children}
			</QueryClientProvider>
		</JotaiProvider>
	)
}
