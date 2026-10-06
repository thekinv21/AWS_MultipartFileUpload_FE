import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core'
import '@mantine/core/styles.css'

import { Providers } from '@/providers'

import './globals.css'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'React Dropzone file upload',
	description: 'Example how to upload file',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
	return (
		<html
			lang='en'
			{...mantineHtmlProps}
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
		>
			<head>
				<ColorSchemeScript defaultColorScheme='auto' />
			</head>
			<body className='min-h-full flex flex-col'>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
