import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'NagarSetu - Smart Civic Issues Management Platform',
  description: 'Bridging the gap between citizens and local administration through technology. Report, track, and resolve civic issues efficiently.',
}

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}
