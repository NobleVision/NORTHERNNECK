import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JR Graham Center – Booking',
  description: 'Unified Next.js app for rental bookings'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

