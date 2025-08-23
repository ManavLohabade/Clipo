import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Clipper DApp - Get Paid for Viral Content',
  description: 'Blockchain-powered campaign engagement platform for viral content creators on Avalanche',
  keywords: ['blockchain', 'avalanche', 'campaign', 'engagement', 'viral content', 'rewards'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
