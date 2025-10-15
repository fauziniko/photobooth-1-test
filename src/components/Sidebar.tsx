'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { 
  Camera, 
  Home, 
  Upload, 
  User, 
  LogOut, 
  Menu, 
  X,
  LogIn,
  UserPlus
} from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  // Don't show sidebar on auth pages OR if not logged in (Navbar will handle navigation)
  if (pathname?.startsWith('/auth') || status === 'unauthenticated') {
    return null
  }

  // Show loading state
  if (status === 'loading') {
    return null
  }

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Photobooth', href: '/photo', icon: Camera },
  ]

  // Add Upload menu ONLY for ADMIN users
  if (session?.user?.role === 'ADMIN') {
    navigation.push({ name: 'Upload Assets', href: '/admin', icon: Upload })
  }

  const isActive = (path: string) => pathname === path

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-[#fa75aa] text-white hover:bg-[#d72688] transition shadow-lg"
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-56 bg-white border-r border-gray-200 shadow-sm`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-4 border-b border-gray-200">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-[#fa75aa] flex items-center justify-center flex-shrink-0">
                <Camera className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-800">PhotoBooth</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 space-y-0.5">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition text-sm ${
                    isActive(item.href)
                      ? 'bg-[#fa75aa] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={16} className="flex-shrink-0" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Section */}
          <div className="p-2 border-t border-gray-200">
            {session?.user ? (
              <div className="space-y-1">
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-md">
                  <div className="w-7 h-7 rounded-full bg-[#fa75aa] flex items-center justify-center flex-shrink-0">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {session.user.name}
                    </p>
                    <p className="text-[10px] text-gray-500 truncate">
                      {session.user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition"
                >
                  <LogOut size={16} className="flex-shrink-0" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <Link
                  href="/auth/signin"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 text-sm bg-[#d72688] text-white rounded-md hover:bg-[#b61f72] transition"
                >
                  <LogIn size={16} className="flex-shrink-0" />
                  <span className="font-medium">Sign In</span>
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setIsOpen(false)}
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
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
