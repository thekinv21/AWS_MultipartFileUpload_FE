'use client'

import { type ReactNode, useState } from 'react'

import { createTheme, MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider as JotaiProvider } from 'jotai'

const theme = createTheme({
	primaryColor: 'blue',
})

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
				<MantineProvider theme={theme} defaultColorScheme='auto'>
					{children}
				</MantineProvider>
			</QueryClientProvider>
		</JotaiProvider>
	)
}
