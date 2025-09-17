import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Alkaff',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="rtl">{children}</body>
    </html>
  )
}
