import type { Metadata } from 'next'
import { Lexend_Deca } from 'next/font/google'
import './globals.css'

const lexendDeca = Lexend_Deca({
	variable: '--font-lexend-deca',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Sound Palette',
	description:
		'A minimalist ambient sound-mixer web app for layering looping sounds with independent volume controls.',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={`${lexendDeca.variable} antialiased root`}>
				{children}
			</body>
		</html>
	)
}
