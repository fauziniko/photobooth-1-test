'use client'

import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Camera, LogOut, LogIn, UserPlus, Shield } from 'lucide-react'

export default function Navbar() {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  // Don't show navbar on auth pages and gallery detail share pages
  if (pathname?.startsWith('/auth') || pathname?.startsWith('/photo/gallery/')) {
    return null
  }

  return (
    <nav className="bg-[#fff7fb] border-b border-[#f3b7d1] shadow-sm sticky top-0 z-30 md:hidden">
      <div className="max-w-7xl mx-auto pl-16 pr-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-[#fa75aa] p-2 rounded-lg">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#fa75aa]">
              PhotoBooth
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {status === 'loading' ? (
              <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
            ) : session ? (
              <>
                <Link
                  href="/photo"
                  className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg text-[#5a2a42] hover:bg-[#ffeaf3] transition"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo
                </Link>
                
                {session.user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg text-[#d72688] hover:bg-[#ffeaf3] transition"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Admin
                  </Link>
                )}

                <div className="flex items-center space-x-3">
                  <div className="hidden md:block text-sm">
                    <p className="font-medium text-gray-900">{session.user.name}</p>
                    <p className="text-xs text-gray-500">{session.user.role}</p>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-[#d72688] to-[#fa75aa] text-white rounded-lg hover:brightness-95 transition"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center px-3 sm:px-4 py-2 text-[#5a2a42] hover:bg-[#ffeaf3] rounded-lg transition"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-[#d72688] to-[#fa75aa] text-white rounded-lg hover:brightness-95 transition"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
