'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Upload, Trash2, RefreshCw, Sticker as StickerIcon } from 'lucide-react'
import ConfirmDialog from '@/components/ConfirmDialog'

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
  const [confirmDeleteItem, setConfirmDeleteItem] = useState<StickerItem | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [name, setName] = useState('')
  const [category, setCategory] = useState('custom')
  const [file, setFile] = useState<File | null>(null)
  const [stickerPreviewUrl, setStickerPreviewUrl] = useState<string | null>(null)
  const [isDraggingSticker, setIsDraggingSticker] = useState(false)

  const stickerInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!file) {
      setStickerPreviewUrl(null)
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setStickerPreviewUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  const fetchStickers = async (isManualRefresh = false, suppressError = false) => {
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
      if (!suppressError) {
        setMessage({ type: 'error', text: 'Gagal memuat daftar sticker.' })
      }
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
    const formElement = event.currentTarget
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
      let data: { error?: string } = {}
      try {
        data = await res.json()
      } catch {
        data = { error: 'Respons server tidak valid.' }
      }

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Upload sticker gagal.' })
        return
      }

      const uploadedUrl =
        typeof (data as { url?: unknown }).url === 'string'
          ? (data as { url: string }).url
          : typeof (data as { stickerUrl?: unknown }).stickerUrl === 'string'
            ? (data as { stickerUrl: string }).stickerUrl
            : ''

      const uploadedName =
        typeof (data as { name?: unknown }).name === 'string' && (data as { name: string }).name.trim()
          ? (data as { name: string }).name.trim()
          : `sticker_${Date.now()}`

      const uploadedObjectName =
        typeof (data as { objectName?: unknown }).objectName === 'string'
          ? (data as { objectName: string }).objectName
          : undefined

      if (!uploadedUrl) {
        setMessage({ type: 'error', text: 'Upload berhasil, tetapi URL sticker tidak diterima dari server.' })
        return
      }

      setStickers(prev => {
        const alreadyExists = prev.some(item => {
          if (uploadedObjectName && item.objectName) {
            return item.objectName === uploadedObjectName
          }
          return item.url === uploadedUrl
        })

        if (alreadyExists) return prev

        return [
          {
            name: uploadedName,
            url: uploadedUrl,
            objectName: uploadedObjectName,
          },
          ...prev,
        ]
      })

      setMessage({ type: 'success', text: 'Sticker berhasil dibuat.' })
      setName('')
      setCategory('custom')
      setFile(null)
      formElement.reset()
      await fetchStickers(true, true)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setMessage({ type: 'error', text: `Terjadi error saat upload sticker: ${errorMessage}` })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (item: StickerItem) => {
    if (!item.objectName) {
      setMessage({ type: 'error', text: 'Path sticker tidak tersedia. Refresh halaman terlebih dahulu.' })
      return
    }

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
      setConfirmDeleteItem(null)
    }
  }

  const handleDropSticker = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()

    const droppedFile = event.dataTransfer.files?.[0]
    if (!droppedFile) return

    setFile(droppedFile)
    setIsDraggingSticker(false)
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
                  className="w-full rounded-lg border border-[#d9c8d1] bg-white px-3 py-2 text-sm text-[#4a2337] placeholder:text-[#a48394] focus:outline-none focus:ring-2 focus:ring-[#f2aacb]"
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
                  className="w-full rounded-lg border border-[#d9c8d1] bg-white px-3 py-2 text-sm text-[#4a2337] placeholder:text-[#a48394] focus:outline-none focus:ring-2 focus:ring-[#f2aacb]"
                />
              </div>

              <div>
                <label htmlFor="sticker-file" className="block text-sm font-medium text-[#5d4150] mb-1">
                  File Sticker
                </label>
                <div
                  onDragOver={event => {
                    event.preventDefault()
                    setIsDraggingSticker(true)
                  }}
                  onDragLeave={() => setIsDraggingSticker(false)}
                  onDrop={handleDropSticker}
                  onClick={() => stickerInputRef.current?.click()}
                  className={`w-full rounded-xl border-2 border-dashed px-4 py-5 text-sm cursor-pointer transition ${
                    isDraggingSticker
                      ? 'border-[#d979ab] bg-[#fff0f7]'
                      : 'border-[#d9c8d1] bg-[#fffafc] hover:bg-[#fff3f8]'
                  }`}
                >
                  <p className="text-[#5d4150] font-medium">Drag & drop file sticker di sini</p>
                  <p className="text-xs text-[#8c6b7a] mt-1">atau klik untuk pilih file</p>
                  <p className="text-xs text-[#6d3f55] mt-2 truncate">
                    {file ? file.name : 'Belum ada file dipilih'}
                  </p>
                  <input
                    ref={stickerInputRef}
                    id="sticker-file"
                    type="file"
                    accept="image/*"
                    onChange={event => setFile(event.target.files?.[0] || null)}
                    className="hidden"
                  />
                </div>
              </div>

              {stickerPreviewUrl && (
                <div className="rounded-xl border border-[#ecd4e1] bg-[#fff7fb] p-3">
                  <p className="text-xs font-semibold text-[#6d3f55] mb-2">Preview Sticker</p>
                  <div className="rounded-lg border border-[#ead7df] bg-white p-2">
                    <div className="aspect-square rounded-md overflow-hidden bg-[#fffafb] border border-[#f0e2e8] flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={stickerPreviewUrl} alt="Sticker preview" className="w-full h-full object-contain" />
                    </div>
                  </div>
                </div>
              )}

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
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
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
                        onClick={() => setConfirmDeleteItem(item)}
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

      <ConfirmDialog
        open={Boolean(confirmDeleteItem)}
        title="Hapus Sticker"
        message={confirmDeleteItem ? `Hapus sticker ${confirmDeleteItem.name}?` : ''}
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        loading={Boolean(deletingObjectName)}
        onCancel={() => {
          if (!deletingObjectName) setConfirmDeleteItem(null)
        }}
        onConfirm={() => {
          if (!confirmDeleteItem) return
          handleDelete(confirmDeleteItem)
        }}
      />
    </div>
  )
}
