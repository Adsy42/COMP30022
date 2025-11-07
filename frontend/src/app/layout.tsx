/**
 * @file Root Next.js layout that wires in fonts, global styles, and metadata for every page.
 * Also applies hydration suppression to avoid mismatches between server and client renders.
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Legal Query AI',
  description: 'AI chatbot to help with your research-related legal query.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
