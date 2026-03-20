'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Image as ImageIcon, Sticker as StickerIcon, ArrowRight } from 'lucide-react'

export default function AdminPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-gray-600">Loading admin dashboard...</p>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-sm sm:text-base text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">Asset Management</h1>
          <p className="text-sm sm:text-base text-gray-700 font-medium">Kelola Frame Template dan Sticker dari satu dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <Link
            href="/admin/frame-template"
            className="group bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-transparent hover:border-[#fa75aa] transition"
          >
            <div className="flex items-center mb-4">
              <div className="bg-[#fa75aa] p-2.5 rounded-lg mr-3 flex-shrink-0">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Frame Template</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              Lihat semua template, buat template kustom, dan hapus template yang tidak dipakai.
            </p>
            <div className="inline-flex items-center text-[#d72688] font-semibold">
              Buka Manajemen
              <ArrowRight className="w-4 h-4 ml-2 transition group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            href="/admin/sticker"
            className="group bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-transparent hover:border-[#d72688] transition"
          >
            <div className="flex items-center mb-4">
              <div className="bg-[#d72688] p-2.5 rounded-lg mr-3 flex-shrink-0">
                <StickerIcon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Sticker</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              Kelola koleksi sticker, upload sticker baru kustom, dan hapus sticker yang tidak aktif.
            </p>
            <div className="inline-flex items-center text-[#d72688] font-semibold">
              Buka Manajemen
              <ArrowRight className="w-4 h-4 ml-2 transition group-hover:translate-x-1" />
            </div>
          </Link>
        </div>

        {/* Info Section */}
        <div className="mt-8 sm:mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-blue-900 mb-2 sm:mb-3">Admin Information</h3>
          <ul className="text-blue-900 space-y-1 sm:space-y-1.5 text-xs sm:text-sm font-medium">
            <li>• Menu manajemen sekarang tersedia di Sidebar</li>
            <li>• Aset yang diupload akan langsung tersedia di editor photobooth</li>
            <li>• Format file yang disarankan: PNG transparan</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
