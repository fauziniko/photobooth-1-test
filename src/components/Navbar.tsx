'use client'

import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Camera, LogOut, LogIn, UserPlus, Shield, Zap } from 'lucide-react'

const ICON_SIZE = 18

export default function Navbar() {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  // Don't show navbar on auth pages and gallery detail share pages
  if (pathname?.startsWith('/auth') || pathname?.startsWith('/photo/gallery/')) {
    return null
  }

  return (
    <nav className="bg-gradient-to-r from-[#fff7fb] to-[#fff0f7] border-b border-[#f3b7d1] shadow-sm sticky top-0 z-30 md:hidden">
      <div className="flex justify-between items-center h-16 px-4 sm:px-6">
        {/* Logo - Mobile Only */}
        <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#fa75aa] to-[#d72688] flex items-center justify-center shadow">
            <Zap size={ICON_SIZE} className="text-white fill-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-[#d72688] leading-tight">Garlet Upgrade</h1>
            <p className="text-xs text-[#8d5a73]">PhotoBooth</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-2">
          {status === 'loading' ? (
            <div className="w-24 h-9 bg-gray-200 animate-pulse rounded-lg"></div>
          ) : session ? (
            <>
              <Link
                href="/photo"
                className="flex items-center justify-center p-2.5 rounded-lg text-[#fa75aa] hover:bg-[#ffeaf3] active:scale-95 transition"
                title="Take Photo"
              >
                <Camera size={ICON_SIZE} />
              </Link>
              
              {session.user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="flex items-center justify-center p-2.5 rounded-lg text-[#d72688] hover:bg-[#ffeaf3] active:scale-95 transition"
                  title="Admin"
                >
                  <Shield size={ICON_SIZE} />
                </Link>
              )}

              <button
                onClick={() => signOut()}
                className="flex items-center justify-center p-2.5 bg-gradient-to-r from-[#d72688] to-[#fa75aa] text-white rounded-lg hover:brightness-95 active:scale-95 transition"
                title="Logout"
              >
                <LogOut size={ICON_SIZE} />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="flex items-center justify-center p-2.5 text-[#d72688] hover:bg-[#ffeaf3] active:scale-95 transition rounded-lg"
                title="Sign In"
              >
                <LogIn size={ICON_SIZE} />
              </Link>
              <Link
                href="/auth/signup"
                className="flex items-center justify-center p-2.5 bg-gradient-to-r from-[#d72688] to-[#fa75aa] text-white rounded-lg hover:brightness-95 active:scale-95 transition"
                title="Sign Up"
              >
                <UserPlus size={ICON_SIZE} />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
