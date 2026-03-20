'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Upload, Trash2, RefreshCw, Sticker as StickerIcon } from 'lucide-react'

type StickerItem = {
  name: string
  url: string
  objectName?: string
}

export default function StickerPage() {
  const { data: session, status } = useSession()

  const [stickers, setStickers] = useState<StickerItem[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deletingObjectName, setDeletingObjectName] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [name, setName] = useState('')
  const [category, setCategory] = useState('custom')
  const [file, setFile] = useState<File | null>(null)

  const fetchStickers = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true)
    } else {
      setLoadingList(true)
    }

    try {
      const res = await fetch('/api/list-sticker')
      const data = await res.json()

      if (Array.isArray(data.stickerItems)) {
        setStickers(data.stickerItems)
      } else if (Array.isArray(data.stickers)) {
        setStickers(
          data.stickers.map((url: string) => {
            const rawName = url.split('/').pop() || 'sticker'
            return {
              name: rawName.replace(/\.[^.]+$/, ''),
              url,
            }
          })
        )
      } else {
        setStickers([])
      }
    } catch {
      setMessage({ type: 'error', text: 'Gagal memuat daftar sticker.' })
    } finally {
      setLoadingList(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchStickers()
  }, [])

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)

    if (!file) {
      setMessage({ type: 'error', text: 'File sticker wajib diisi.' })
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('name', name.trim() || `sticker_${Date.now()}`)
      formData.append('category', category.trim() || 'custom')

      const res = await fetch('/api/upload-sticker', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Upload sticker gagal.' })
        return
      }

      setMessage({ type: 'success', text: 'Sticker berhasil dibuat.' })
      setName('')
      setCategory('custom')
      setFile(null)
      event.currentTarget.reset()
      fetchStickers(true)
    } catch {
      setMessage({ type: 'error', text: 'Terjadi error saat upload sticker.' })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (item: StickerItem) => {
    if (!item.objectName) {
      setMessage({ type: 'error', text: 'Path sticker tidak tersedia. Refresh halaman terlebih dahulu.' })
      return
    }

    const shouldDelete = window.confirm(`Hapus sticker ${item.name}?`)
    if (!shouldDelete) return

    setDeletingObjectName(item.objectName)
    setMessage(null)

    try {
      const res = await fetch(`/api/delete-sticker?objectName=${encodeURIComponent(item.objectName)}`, {
        method: 'DELETE',
      })
      const data = await res.json()

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Gagal menghapus sticker.' })
        return
      }

      setMessage({ type: 'success', text: `Sticker ${item.name} berhasil dihapus.` })
      setStickers(prev => prev.filter(sticker => sticker.objectName !== item.objectName))
    } catch {
      setMessage({ type: 'error', text: 'Terjadi error saat menghapus sticker.' })
    } finally {
      setDeletingObjectName(null)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-gray-600">Loading...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-[#fff7fb] via-[#ffeaf4] to-[#fff5fa] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#4f3040]">Sticker</h1>
            <p className="text-sm sm:text-base text-[#705362] mt-1">Lihat, buat, dan hapus sticker kustom.</p>
          </div>
          <button
            type="button"
            onClick={() => fetchStickers(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-[#e7a0c2] text-[#6d3f55] bg-[#fff3f9] hover:bg-[#ffe7f2] transition disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {message && (
          <div
            className={`rounded-lg p-3 text-sm border ${
              message.type === 'error'
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-green-50 text-green-700 border-green-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1 bg-white rounded-2xl shadow-lg p-5 sm:p-6 h-fit border border-[#f3d7e5]">
            <h2 className="text-xl font-semibold text-[#4f3040] mb-4">Buat Sticker Baru</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label htmlFor="sticker-name" className="block text-sm font-medium text-[#5d4150] mb-1">
                  Nama Sticker
                </label>
                <input
                  id="sticker-name"
                  type="text"
                  value={name}
                  onChange={event => setName(event.target.value)}
                  placeholder="contoh: heart-sparkle"
                  className="w-full rounded-lg border border-[#d9c8d1] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f2aacb]"
                />
              </div>

              <div>
                <label htmlFor="sticker-category" className="block text-sm font-medium text-[#5d4150] mb-1">
                  Kategori
                </label>
                <input
                  id="sticker-category"
                  type="text"
                  value={category}
                  onChange={event => setCategory(event.target.value)}
                  placeholder="contoh: wedding"
                  className="w-full rounded-lg border border-[#d9c8d1] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f2aacb]"
                />
              </div>

              <div>
                <label htmlFor="sticker-file" className="block text-sm font-medium text-[#5d4150] mb-1">
                  File Sticker
                </label>
                <input
                  id="sticker-file"
                  type="file"
                  accept="image/*"
                  onChange={event => setFile(event.target.files?.[0] || null)}
                  required
                  className="w-full text-sm border border-[#d9c8d1] rounded-lg px-3 py-2"
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-[#f8bfd7] text-[#4a2337] border border-[#e7a0c2] hover:bg-[#f2aacb] transition disabled:opacity-60"
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Simpan Sticker'}
              </button>
            </form>
          </div>

          <div className="xl:col-span-2 bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-[#f3d7e5]">
            <h2 className="text-xl font-semibold text-[#4f3040] mb-4">Daftar Sticker</h2>

            {loadingList ? (
              <p className="text-sm text-gray-500">Memuat data sticker...</p>
            ) : stickers.length === 0 ? (
              <p className="text-sm text-gray-500">Belum ada sticker.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {stickers.map(item => (
                  <div key={`${item.name}-${item.url}`} className="border border-gray-200 rounded-xl p-3">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-50 border border-gray-100 mb-2 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.url} alt={item.name} className="w-full h-full object-contain" />
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-medium text-gray-700 truncate" title={item.name}>
                        {item.name}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        disabled={deletingObjectName === item.objectName || !item.objectName}
                        className="inline-flex items-center text-[11px] px-2 py-1 rounded-md border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-60"
                      >
                        {deletingObjectName === item.objectName ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 text-xs text-[#705362] flex items-center">
              <StickerIcon className="w-3.5 h-3.5 mr-1.5" />
              Tip: gunakan PNG transparan agar hasil sticker di photobooth lebih rapi.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
