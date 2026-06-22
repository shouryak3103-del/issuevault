import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'IssueVault — Track. Fix. Ship.',
  description: 'Professional Issue Tracking System connected to Supabase',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="grid-bg">{children}</body>
    </html>
  )
}
