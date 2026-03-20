'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { 
  Camera, 
  Home, 
  Images,
  Image,
  Sticker,
  User, 
  LogOut, 
  Menu, 
  X,
  ChevronLeft,
  ChevronRight,
  LogIn,
  UserPlus
} from 'lucide-react'

const SIDEBAR_STORAGE_KEY = 'photobooth-sidebar-open'
const SIDEBAR_EVENT_NAME = 'photobooth-sidebar-change'

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isDesktopOpen, setIsDesktopOpen] = useState(true)

  useEffect(() => {
    const stored = window.localStorage.getItem(SIDEBAR_STORAGE_KEY)
    if (stored === '0') {
      setIsDesktopOpen(false)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, isDesktopOpen ? '1' : '0')
    window.dispatchEvent(new CustomEvent(SIDEBAR_EVENT_NAME, { detail: { open: isDesktopOpen } }))
  }, [isDesktopOpen])

  // Don't show sidebar on auth pages and gallery detail share pages
  if (pathname?.startsWith('/auth') || pathname?.startsWith('/photo/gallery/')) {
    return null
  }

  // Show loading state
  if (status === 'loading') {
    return null
  }

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Photobooth', href: '/photo', icon: Camera },
    { name: 'Photo Gallery', href: '/photo/gallery', icon: Images },
  ]

  // Add admin menus only for ADMIN users
  if (session?.user?.role === 'ADMIN') {
    navigation.push({ name: 'Buat Template', href: '/admin/frame-template', icon: Image })
    navigation.push({ name: 'Daftar Template', href: '/admin/frame-template/list', icon: Images })
    navigation.push({ name: 'Sticker', href: '/admin/sticker', icon: Sticker })
  }

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  return (
    <>
      {/* Desktop Toggle Button */}
      <button
        onClick={() => setIsDesktopOpen(prev => !prev)}
        className="hidden md:flex fixed top-4 z-50 h-11 w-11 items-center justify-center rounded-xl bg-[#f8bfd7] text-[#4a2337] border border-[#e7a0c2] hover:bg-[#f2aacb] transition-[left] duration-300 shadow-lg"
        style={{ left: isDesktopOpen ? '14.5rem' : '1rem' }}
      >
        {isDesktopOpen ? <ChevronLeft size={22} strokeWidth={2.5} /> : <ChevronRight size={22} strokeWidth={2.5} />}
      </button>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(prev => !prev)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-[#fa75aa] text-white hover:bg-[#d72688] transition shadow-lg"
      >
        {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isDesktopOpen ? 'md:translate-x-0' : 'md:-translate-x-full'} w-[82vw] max-w-[16rem] md:w-56 bg-[#fff7fb] border-r border-[#f3b7d1] shadow-sm`}
      >
        <div className="h-full flex flex-col overflow-y-auto">
          {/* Logo */}
          <div className="p-4 border-b border-[#f3b7d1]">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-[#fa75aa] flex items-center justify-center flex-shrink-0">
                <Camera className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-[#5a2a42]">PhotoBooth</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2.5 rounded-md transition text-sm ${
                    isActive(item.href)
                      ? 'bg-[#fa75aa] text-white'
                      : 'text-[#5a2a42] hover:bg-[#ffeaf3]'
                  }`}
                >
                  <Icon size={16} className="flex-shrink-0" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Section */}
          <div className="p-2 border-t border-[#f3b7d1]">
            {session?.user ? (
              <div className="space-y-1">
                <div className="flex items-center space-x-2 px-3 py-2 bg-[#fff0f7] rounded-md border border-[#f3b7d1]">
                  <div className="w-7 h-7 rounded-full bg-[#fa75aa] flex items-center justify-center flex-shrink-0">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#5a2a42] truncate">
                      {session.user.name}
                    </p>
                    <p className="text-[10px] text-[#8d5a73] truncate">
                      {session.user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-[#5a2a42] hover:bg-[#ffeaf3] rounded-md transition"
                >
                  <LogOut size={16} className="flex-shrink-0" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <Link
                  href="/auth/signin"
                  onClick={() => setIsMobileOpen(false)}
                  className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 text-sm bg-[#d72688] text-white rounded-md hover:bg-[#b61f72] transition"
                >
                  <LogIn size={16} className="flex-shrink-0" />
                  <span className="font-medium">Sign In</span>
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setIsMobileOpen(false)}
                  className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 text-sm border border-[#fa75aa] text-[#fa75aa] rounded-md hover:bg-[#fa75aa] hover:text-white transition"
                >
                  <UserPlus size={16} className="flex-shrink-0" />
                  <span className="font-medium">Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-[#fa75aa]/20"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  )
}
