'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { 
  Camera, 
  Images,
  Image,
  Sticker,
  User, 
  LogOut, 
  Menu, 
  X,
  LogIn,
  UserPlus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const ICON_SIZE = 18
const SIDEBAR_STORAGE_KEY = 'photobooth-sidebar-open'
const SIDEBAR_EVENT_NAME = 'photobooth-sidebar-change'

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isDesktopOpen, setIsDesktopOpen] = useState(true)
  const [isDesktopStateReady, setIsDesktopStateReady] = useState(false)

  // Load and sync sidebar state from localStorage
  useEffect(() => {
    const stored = window.localStorage.getItem(SIDEBAR_STORAGE_KEY)
    if (stored === 'false') {
      setIsDesktopOpen(false)
    }
    setIsDesktopStateReady(true)
  }, [])

  useEffect(() => {
    if (!isDesktopStateReady) return
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, isDesktopOpen ? 'true' : 'false')
    window.dispatchEvent(new CustomEvent(SIDEBAR_EVENT_NAME, { detail: { open: isDesktopOpen } }))
  }, [isDesktopOpen, isDesktopStateReady])

  // Hide sidebar only on auth and shared gallery detail pages
  if (pathname?.startsWith('/auth') || pathname?.startsWith('/photo/gallery/')) {
    return null
  }

  // Show loading state
  if (status === 'loading') {
    return null
  }

  // Sidebar is available only for authenticated users.
  if (!session?.user) {
    return null
  }

  // User navigation
  const userNavigation = [
    { name: 'PhotoBooth', href: '/photo', icon: Camera },
    { name: 'Photo Gallery', href: '/photo/gallery', icon: Images },
    { name: 'Uploaded Photos', href: '/photo/uploaded', icon: Images },
  ]

  // Admin navigation
  const adminNavigation = [
    { name: 'Create Template', href: '/admin/frame-template', icon: Image },
    { name: 'Template List', href: '/admin/frame-template/list', icon: Images },
    { name: 'Create Sticker', href: '/admin/sticker/new', icon: Sticker },
    { name: 'Sticker List', href: '/admin/sticker/list', icon: Images },
  ]

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  return (
    <>
      {/* Desktop Toggle Button */}
      <button
        onClick={() => setIsDesktopOpen(prev => !prev)}
        className="hidden lg:flex fixed top-4 z-50 h-10 w-10 items-center justify-center rounded-lg bg-[#ffeaf3] text-[#d72688] border border-[#f3b7d1] hover:bg-[#fa75aa] hover:text-white active:scale-95 transition shadow-lg"
        style={{ left: isDesktopOpen ? '14.5rem' : '1rem' }}
        aria-label={isDesktopOpen ? "Close sidebar" : "Open sidebar"}
        title={isDesktopOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isDesktopOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(prev => !prev)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-lg bg-[#fa75aa] text-white hover:bg-[#d72688] active:scale-95 transition shadow-lg"
        aria-label={isMobileOpen ? "Close menu" : "Open menu"}
      >
        {isMobileOpen ? <X size={ICON_SIZE} /> : <Menu size={ICON_SIZE} />}
      </button>

      {/* Desktop Sidebar - Collapsible */}
      <aside 
        className={`hidden lg:flex lg:flex-col fixed top-0 left-0 z-40 h-screen bg-[#fff7fb] border-r border-[#f3b7d1] overflow-y-auto transition-all duration-300 ${
          isDesktopOpen ? 'w-56' : 'w-0'
        }`}
      >
        {isDesktopOpen && (
          <>
            {/* Logo & Branding */}
            <div className="sticky top-0 bg-[#fff7fb] p-4 border-b border-[#f3b7d1]">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#fa75aa] flex items-center justify-center flex-shrink-0">
                  <Camera className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-[#5a2a42] text-sm">PhotoBooth</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {/* User Menu Section */}
              <div className="mb-3">
                <p className="px-3 py-2 text-xs font-semibold text-[#8d5a73] uppercase tracking-wide">Main Menu</p>
                <div className="space-y-1">
                  {userNavigation.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-md transition text-sm ${
                          isActive(item.href)
                            ? 'bg-[#fa75aa] text-white font-medium'
                            : 'text-[#5a2a42] hover:bg-[#ffeaf3]'
                        }`}
                      >
                        <Icon size={ICON_SIZE} className="flex-shrink-0" />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Admin Menu Section */}
              {session?.user?.role === 'ADMIN' && (
                <div className="pt-2 mt-3 border-t border-[#f3b7d1]">
                  <p className="px-3 py-2 text-xs font-semibold text-[#8d5a73] uppercase tracking-wide">Admin</p>
                  <div className="space-y-1">
                    {adminNavigation.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-md transition text-sm ${
                            isActive(item.href)
                              ? 'bg-[#fa75aa] text-white font-medium'
                              : 'text-[#5a2a42] hover:bg-[#ffeaf3]'
                          }`}
                        >
                          <Icon size={ICON_SIZE} className="flex-shrink-0" />
                          <span>{item.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </nav>

            {/* User Profile Section */}
            <div className="p-3 border-t border-[#f3b7d1] bg-[#fff7fb]">
              {session?.user ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-[#fff0f7] rounded-md border border-[#f3b7d1]">
                    <div className="w-7 h-7 rounded-full bg-[#fa75aa] flex items-center justify-center flex-shrink-0">
                      <User size={14} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#5a2a42] truncate">{session.user.name}</p>
                      <p className="text-[10px] text-[#8d5a73] truncate">{session.user.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-[#5a2a42] hover:bg-[#ffeaf3] rounded-md transition"
                  >
                    <LogOut size={ICON_SIZE} className="flex-shrink-0" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/auth/signin"
                    className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs bg-[#d72688] text-white rounded-md hover:bg-[#b61f72] transition"
                  >
                    <LogIn size={ICON_SIZE} className="flex-shrink-0" />
                    <span className="font-medium">Sign In</span>
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </aside>

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-[280px] bg-[#fff7fb] border-r border-[#f3b7d1] shadow-xl transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:hidden overflow-y-auto`}
      >
        <div className="flex flex-col h-full">
          {/* Logo - Mobile */}
          <div className="p-4 border-b border-[#f3b7d1]">
            <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileOpen(false)}>
              <div className="w-9 h-9 rounded-lg bg-[#fa75aa] flex items-center justify-center flex-shrink-0">
                <Camera className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-[#5a2a42]">PhotoBooth</span>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {/* User Menu Section */}
            <div className="mb-3">
              <p className="px-3 py-2 text-xs font-semibold text-[#8d5a73] uppercase tracking-wide">Main Menu</p>
              <div className="space-y-1">
                {userNavigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md transition active:scale-95 text-sm ${
                        isActive(item.href)
                          ? 'bg-[#fa75aa] text-white font-medium'
                          : 'text-[#5a2a42] hover:bg-[#ffeaf3]'
                      }`}
                    >
                      <Icon size={ICON_SIZE} className="flex-shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Admin Menu Section */}
            {session?.user?.role === 'ADMIN' && (
              <div className="pt-2 mt-3 border-t border-[#f3b7d1]">
                <p className="px-3 py-2 text-xs font-semibold text-[#8d5a73] uppercase tracking-wide">Admin</p>
                <div className="space-y-1">
                  {adminNavigation.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center space-x-2 px-3 py-3 rounded-md transition active:scale-95 ${
                          isActive(item.href)
                            ? 'bg-[#fa75aa] text-white font-medium'
                            : 'text-[#5a2a42] hover:bg-[#ffeaf3]'
                        }`}
                      >
                        <Icon size={ICON_SIZE} className="flex-shrink-0" />
                        <span className="text-sm">{item.name}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </nav>

          {/* User Profile Section - Mobile */}
          <div className="p-3 border-t border-[#f3b7d1] bg-[#fff7fb]">
            {session?.user ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 px-3 py-2 bg-[#fff0f7] rounded-md border border-[#f3b7d1]">
                  <div className="w-7 h-7 rounded-full bg-[#fa75aa] flex items-center justify-center flex-shrink-0">
                    <User size={14} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#5a2a42] truncate">{session.user.name}</p>
                    <p className="text-[10px] text-[#8d5a73] truncate">{session.user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsMobileOpen(false)
                    signOut({ callbackUrl: '/' })
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-3 text-xs text-[#5a2a42] hover:bg-[#ffeaf3] rounded-md transition"
                >
                  <LogOut size={ICON_SIZE} className="flex-shrink-0" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/auth/signin"
                  onClick={() => setIsMobileOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-3 text-xs bg-[#d72688] text-white rounded-md hover:bg-[#b61f72] transition"
                >
                  <LogIn size={ICON_SIZE} className="flex-shrink-0" />
                  <span className="font-medium">Sign In</span>
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setIsMobileOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-3 text-xs border-2 border-[#fa75aa] text-[#fa75aa] rounded-md hover:bg-[#fa75aa] hover:text-white transition"
                >
                  <UserPlus size={ICON_SIZE} className="flex-shrink-0" />
                  <span className="font-medium">Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  )
}
