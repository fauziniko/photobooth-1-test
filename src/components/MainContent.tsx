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
      setIsDesktopSidebarOpen(stored !== 'false')
    }

    const handleSidebarChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ open?: boolean }>
      if (typeof customEvent.detail?.open === 'boolean') {
        setIsDesktopSidebarOpen(customEvent.detail.open)
        return
      }

      applyStoredState()
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === SIDEBAR_STORAGE_KEY) {
        setIsDesktopSidebarOpen(e.newValue !== 'false')
      }
    }

    applyStoredState()
    window.addEventListener(SIDEBAR_EVENT_NAME, handleSidebarChange as EventListener)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener(SIDEBAR_EVENT_NAME, handleSidebarChange as EventListener)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const showSidebar = !pathname?.startsWith('/auth') && !pathname?.startsWith('/photo/gallery/')
  
  return (
    <main
      className={showSidebar
        ? isDesktopSidebarOpen
          ? 'w-full box-border md:pl-56 transition-[padding] duration-300'
          : 'w-full box-border md:pl-0 transition-[padding] duration-300'
        : 'w-full box-border transition-[padding] duration-300'}
    >
      {children}
    </main>
  )
}
