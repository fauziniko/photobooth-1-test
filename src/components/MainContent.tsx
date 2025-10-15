'use client'

import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

export default function MainContent({ children }: { children: ReactNode }) {
  const { status } = useSession()
  const pathname = usePathname()
  
  // Check if sidebar should be shown (not on auth pages, and user is authenticated)
  const showSidebar = !pathname?.startsWith('/auth') && status === 'authenticated'
  
  return (
    <main className={showSidebar ? 'lg:ml-56' : ''}>
      {children}
    </main>
  )
}
