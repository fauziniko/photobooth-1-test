'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { RefreshCw, Sticker as StickerIcon, Trash2 } from 'lucide-react'
import ConfirmDialog from '@/components/ConfirmDialog'

type StickerItem = {
  name: string
  url: string
  objectName?: string
}

export default function StickerListPage() {
  const { data: session, status } = useSession()

  const [stickers, setStickers] = useState<StickerItem[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [deletingObjectName, setDeletingObjectName] = useState<string | null>(null)
  const [confirmDeleteItem, setConfirmDeleteItem] = useState<StickerItem | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchStickers = async (isManualRefresh = false, suppressError = false) => {
    if (isManualRefresh) {
      setRefreshing(true)
    } else {
      setLoadingList(true)
    }

    try {
      const res = await fetch('/api/list-sticker', { cache: 'no-store' })
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

    const onUpdated = () => {
      fetchStickers(true, true)
    }

    window.addEventListener('stickerLibraryUpdated', onUpdated)
    return () => {
      window.removeEventListener('stickerLibraryUpdated', onUpdated)
    }
  }, [])

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
            <h1 className="text-3xl sm:text-4xl font-bold text-[#4f3040]">Daftar Sticker</h1>
            <p className="text-sm sm:text-base text-[#705362] mt-1">Kelola sticker yang sudah disimpan.</p>
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

        <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-[#f3d7e5]">
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
