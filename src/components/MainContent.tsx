'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

const SIDEBAR_STORAGE_KEY = 'photobooth-sidebar-open'
const SIDEBAR_EVENT_NAME = 'photobooth-sidebar-change'

export default function MainContent({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true)

  useEffect(() => {
    const applyStoredState = () => {
      const stored = window.localStorage.getItem(SIDEBAR_STORAGE_KEY)
      setIsDesktopSidebarOpen(stored !== '0')
    }

    const handleSidebarChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ open?: boolean }>
      if (typeof customEvent.detail?.open === 'boolean') {
        setIsDesktopSidebarOpen(customEvent.detail.open)
        return
      }

      applyStoredState()
    }

    applyStoredState()
    window.addEventListener(SIDEBAR_EVENT_NAME, handleSidebarChange as EventListener)
    window.addEventListener('storage', applyStoredState)

    return () => {
      window.removeEventListener(SIDEBAR_EVENT_NAME, handleSidebarChange as EventListener)
      window.removeEventListener('storage', applyStoredState)
    }
  }, [])
  
  // Check if sidebar should be shown (not on auth pages)
  const showSidebar = !pathname?.startsWith('/auth') && !pathname?.startsWith('/photo/gallery/')
  
  return (
    <main className={showSidebar && isDesktopSidebarOpen ? 'md:ml-56 transition-[margin] duration-300' : 'transition-[margin] duration-300'}>
      {children}
    </main>
  )
}
