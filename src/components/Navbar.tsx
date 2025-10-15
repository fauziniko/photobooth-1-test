'use client'

import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Camera, LogOut, LogIn, UserPlus, Shield } from 'lucide-react'

export default function Navbar() {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  // Don't show navbar on auth pages
  if (pathname?.startsWith('/auth')) {
    return null
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-2 rounded-lg">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              PhotoBooth
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
            ) : session ? (
              <>
                <Link
                  href="/photo"
                  className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-pink-50 transition"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo
                </Link>
                
                {session.user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg text-purple-600 hover:bg-purple-50 transition"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Admin
                  </Link>
                )}

                <div className="flex items-center space-x-3">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{session.user.name}</p>
                    <p className="text-xs text-gray-500">{session.user.role}</p>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition"
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
                  className="inline-flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition"
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
