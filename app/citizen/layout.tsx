'use client'

import CitizenAuthGuard from '@/components/citizen/CitizenAuthGuard'
import CitizenNavigation from '@/components/citizen/CitizenNavigation'

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CitizenAuthGuard>
      <div className="min-h-screen bg-gray-50">
        <main className="pb-20">
          {children}
        </main>
        <CitizenNavigation />
      </div>
    </CitizenAuthGuard>
  )
}
