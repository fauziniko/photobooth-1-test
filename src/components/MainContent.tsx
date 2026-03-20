'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

export default function MainContent({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  
  // Check if sidebar should be shown (not on auth pages)
  const showSidebar = !pathname?.startsWith('/auth') && !pathname?.startsWith('/photo/gallery/')
  
  return (
    <main className={showSidebar ? 'lg:ml-56' : ''}>
      {children}
    </main>
  )
}
