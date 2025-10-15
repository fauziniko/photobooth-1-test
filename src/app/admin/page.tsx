'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { Upload, Image as ImageIcon, Sticker as StickerIcon } from 'lucide-react'

export default function AdminPage() {
  const { data: session } = useSession()
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  const handleFrameUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUploading(true)
    setMessage('')

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch('/api/upload-frame-template', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Frame template uploaded successfully!')
        e.currentTarget.reset()
      } else {
        setMessage(`Error: ${data.error || 'Upload failed'}`)
      }
    } catch {
      setMessage('An error occurred during upload')
    } finally {
      setUploading(false)
    }
  }

  const handleStickerUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUploading(true)
    setMessage('')

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch('/api/upload-sticker', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Sticker uploaded successfully!')
        e.currentTarget.reset()
      } else {
        setMessage(`Error: ${data.error || 'Upload failed'}`)
      }
    } catch {
      setMessage('An error occurred during upload')
    } finally {
      setUploading(false)
    }
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
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-700 font-medium">Manage frame templates and stickers</p>
        </div>

        {message && (
          <div className={`mb-6 p-3 sm:p-4 rounded-lg text-sm sm:text-base ${message.includes('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Upload Frame Template */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <div className="bg-[#fa75aa] p-2.5 rounded-lg mr-3 flex-shrink-0">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Upload Frame Template</h2>
            </div>

            <form onSubmit={handleFrameUpload} className="space-y-3 sm:space-y-4">
              <div>
                <label htmlFor="frameName" className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 sm:mb-2">
                  Template Name
                </label>
                <input
                  id="frameName"
                  name="name"
                  type="text"
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fa75aa] focus:border-transparent transition"
                  placeholder="e.g., Birthday Frame"
                />
              </div>

              <div>
                <label htmlFor="frameFile" className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 sm:mb-2">
                  Frame Image
                </label>
                <input
                  id="frameFile"
                  name="frame"
                  type="file"
                  accept="image/*"
                  required
                  className="w-full px-3 sm:px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fa75aa] focus:border-transparent transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#fa75aa] file:text-white hover:file:bg-[#d72688] file:cursor-pointer"
                />
              </div>

              <div>
                <label htmlFor="stickerFile" className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 sm:mb-2">
                  Sticker Image (Optional)
                </label>
                <input
                  id="stickerFile"
                  name="sticker"
                  type="file"
                  accept="image/*"
                  className="w-full px-3 sm:px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fa75aa] focus:border-transparent transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#fa75aa] file:text-white hover:file:bg-[#d72688] file:cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-[#d72688] text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-[#b61f72] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <Upload className="w-4 h-4 mr-2 flex-shrink-0" />
                {uploading ? 'Uploading...' : 'Upload Frame'}
              </button>
            </form>
          </div>

          {/* Upload Sticker */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <div className="bg-[#d72688] p-2.5 rounded-lg mr-3 flex-shrink-0">
                <StickerIcon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Upload Sticker</h2>
            </div>

            <form onSubmit={handleStickerUpload} className="space-y-3 sm:space-y-4">
              <div>
                <label htmlFor="stickerName" className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 sm:mb-2">
                  Sticker Name
                </label>
                <input
                  id="stickerName"
                  name="name"
                  type="text"
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d72688] focus:border-transparent transition"
                  placeholder="e.g., Heart Sticker"
                />
              </div>

              <div>
                <label htmlFor="stickerImageFile" className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 sm:mb-2">
                  Sticker Image
                </label>
                <input
                  id="stickerImageFile"
                  name="sticker"
                  type="file"
                  accept="image/*"
                  required
                  className="w-full px-3 sm:px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d72688] focus:border-transparent transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#d72688] file:text-white hover:file:bg-[#b61f72] file:cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-[#fa75aa] text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-[#d72688] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <Upload className="w-4 h-4 mr-2 flex-shrink-0" />
                {uploading ? 'Uploading...' : 'Upload Sticker'}
              </button>
            </form>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 sm:mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-blue-900 mb-2 sm:mb-3">Admin Information</h3>
          <ul className="text-blue-900 space-y-1 sm:space-y-1.5 text-xs sm:text-sm font-medium">
            <li>• Only admins can upload frame templates and stickers</li>
            <li>• Users can use uploaded templates to create their photo strips</li>
            <li>• Supported formats: PNG, JPG, JPEG, GIF</li>
            <li>• Recommended: Use transparent PNG for stickers</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
