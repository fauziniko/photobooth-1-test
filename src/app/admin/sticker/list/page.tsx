'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Check, Pencil, Plus, RefreshCw, Search, Sticker as StickerIcon, Trash2, X } from 'lucide-react'
import ConfirmDialog from '@/components/ConfirmDialog'

type StickerItem = {
  name: string
  url: string
  objectName?: string
}

const toSafeValue = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')

const extractCategory = (objectName?: string) => {
  const parts = String(objectName || '').split('/')
  return parts[1] || 'uncategorized'
}

export default function StickerListPage() {
  const { data: session, status } = useSession()

  const [stickers, setStickers] = useState<StickerItem[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [deletingObjectName, setDeletingObjectName] = useState<string | null>(null)
  const [savingObjectName, setSavingObjectName] = useState<string | null>(null)
  const [confirmDeleteItem, setConfirmDeleteItem] = useState<StickerItem | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [keyword, setKeyword] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [editing, setEditing] = useState<{ objectName: string; name: string; category: string } | null>(null)

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
        setMessage({ type: 'error', text: 'Failed to load sticker list.' })
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

  const categoryOptions = useMemo(() => {
    const unique = new Set(stickers.map(item => extractCategory(item.objectName)))
    return ['all', ...Array.from(unique).sort()]
  }, [stickers])

  const filteredStickers = useMemo(() => {
    const search = keyword.trim().toLowerCase()
    return stickers.filter(item => {
      const category = extractCategory(item.objectName)
      const categoryMatch = categoryFilter === 'all' || category === categoryFilter
      if (!categoryMatch) return false

      if (!search) return true

      const searchable = [item.name, category, item.objectName || ''].join(' ').toLowerCase()
      return searchable.includes(search)
    })
  }, [stickers, keyword, categoryFilter])

  const startEdit = (item: StickerItem) => {
    if (!item.objectName) {
      setMessage({ type: 'error', text: 'Sticker path is unavailable. Please refresh first.' })
      return
    }

    setEditing({
      objectName: item.objectName,
      name: item.name,
      category: extractCategory(item.objectName),
    })
    setMessage(null)
  }

  const cancelEdit = () => {
    if (savingObjectName) return
    setEditing(null)
  }

  const saveEdit = async () => {
    if (!editing) return

    const safeName = toSafeValue(editing.name)
    const safeCategory = toSafeValue(editing.category) || 'custom'

    if (!safeName) {
      setMessage({ type: 'error', text: 'Sticker name is required.' })
      return
    }

    setSavingObjectName(editing.objectName)
    setMessage(null)

    try {
      const res = await fetch('/api/update-sticker', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          objectName: editing.objectName,
          name: safeName,
          category: safeCategory,
        }),
      })

      const data = await res.json().catch(() => ({ error: 'Invalid server response.' }))
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Failed to update sticker.' })
        return
      }

      const updatedItem = data?.item as StickerItem | undefined
      const previousObjectName = String(data?.previousObjectName || editing.objectName)
      if (updatedItem?.objectName) {
        setStickers(prev =>
          prev.map(item => (item.objectName === previousObjectName ? updatedItem : item))
        )
      }

      setEditing(null)
      setMessage({ type: 'success', text: 'Sticker updated successfully.' })
      window.dispatchEvent(new Event('stickerLibraryUpdated'))
    } catch {
      setMessage({ type: 'error', text: 'An error occurred while updating sticker.' })
    } finally {
      setSavingObjectName(null)
    }
  }

  const handleDelete = async (item: StickerItem) => {
    if (!item.objectName) {
      setMessage({ type: 'error', text: 'Sticker path is unavailable. Please refresh first.' })
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
        setMessage({ type: 'error', text: data.error || 'Failed to delete sticker.' })
        return
      }

      setMessage({ type: 'success', text: `Sticker ${item.name} deleted successfully.` })
      setStickers(prev => prev.filter(sticker => sticker.objectName !== item.objectName))
    } catch {
      setMessage({ type: 'error', text: 'An error occurred while deleting sticker.' })
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
    <div className="min-h-screen bg-gradient-to-br from-[#fff7fb] via-[#ffeaf4] to-[#fff5fa] py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#4f3040]">Sticker Library</h1>
            <p className="text-sm text-[#705362] mt-1">Browse, search, edit, and delete stickers efficiently.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/sticker/new"
              className="inline-flex items-center justify-center px-3 py-2 rounded-lg border border-[#d992b4] text-[#4f3040] bg-[#ffd5e8] hover:bg-[#ffc6e0] transition text-sm"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Sticker
            </Link>
            <button
              type="button"
              onClick={() => fetchStickers(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center px-3 py-2 rounded-lg border border-[#e7a0c2] text-[#6d3f55] bg-[#fff3f9] hover:bg-[#ffe7f2] transition disabled:opacity-60 text-sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
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

        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-5 border border-[#f3d7e5]">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-2.5 mb-4 items-end">
            <label className="md:col-span-3 flex flex-col gap-1">
              <span className="text-xs text-[#7d5b6c]">Search</span>
              <div className="relative">
                <Search className="w-4 h-4 text-[#9d7a8b] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={keyword}
                  onChange={event => setKeyword(event.target.value)}
                  placeholder="Search by name, category, or sticker path..."
                  className="h-11 w-full rounded-lg border border-[#e3ccd8] bg-[#fff9fc] pl-9 pr-3 text-sm text-[#4f3040] focus:outline-none focus:ring-2 focus:ring-[#f2aacb]"
                />
              </div>
            </label>
            <label className="md:col-span-2 flex flex-col gap-1">
              <span className="text-xs text-[#7d5b6c]">Category</span>
              <select
                value={categoryFilter}
                onChange={event => setCategoryFilter(event.target.value)}
                className="h-11 w-full rounded-lg border border-[#e3ccd8] bg-white px-3 text-sm text-[#4f3040] focus:outline-none focus:ring-2 focus:ring-[#f2aacb]"
              >
                {categoryOptions.map(option => (
                  <option key={option} value={option}>
                    {option === 'all' ? 'All Categories' : option}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-[#7d5b6c]">Result</span>
              <div className="h-11 rounded-lg border border-[#ecd4e1] bg-[#fff7fb] px-3 text-xs text-[#6a485a] flex items-center justify-between">
                <span>Shown</span>
                <span className="font-semibold text-sm text-[#4f3040]">{filteredStickers.length}</span>
              </div>
            </div>
          </div>

          {loadingList ? (
            <p className="text-sm text-gray-500">Loading stickers...</p>
          ) : filteredStickers.length === 0 ? (
            <p className="text-sm text-gray-500">No stickers found for the current filter.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-3">
              {filteredStickers.map(item => {
                const category = extractCategory(item.objectName)
                const isEditing = editing?.objectName === item.objectName

                return (
                <div key={`${item.name}-${item.url}`} className="border border-[#efd9e5] rounded-xl p-2.5 bg-white hover:shadow-sm transition-shadow">
                  <div className="aspect-square rounded-lg overflow-hidden bg-[#fff8fc] border border-[#f2e5ec] mb-2 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.url} alt={item.name} loading="lazy" decoding="async" className="w-full h-full object-contain" />
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="text-[10px] inline-flex px-2 py-0.5 rounded-full bg-[#fff0f7] text-[#6d3f55] border border-[#f0c5da] max-w-full truncate">
                      {category}
                    </p>
                    {!isEditing && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(item)}
                          disabled={Boolean(deletingObjectName || savingObjectName)}
                          className="inline-flex items-center justify-center w-6 h-6 rounded-md border border-amber-200 text-amber-700 hover:bg-amber-50 disabled:opacity-60"
                          title="Edit"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteItem(item)}
                          disabled={deletingObjectName === item.objectName || !item.objectName}
                          className="inline-flex items-center justify-center w-6 h-6 rounded-md border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-60"
                          title="Delete"
                        >
                          {deletingObjectName === item.objectName ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : (
                            <Trash2 className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editing.name}
                        onChange={event => setEditing(prev => (prev ? { ...prev, name: event.target.value } : prev))}
                        placeholder="sticker-name"
                        className="w-full rounded-md border border-[#dec2d0] px-2 py-1 text-xs text-[#4f3040] focus:outline-none focus:ring-2 focus:ring-[#f2aacb]"
                      />
                      <input
                        type="text"
                        value={editing.category}
                        onChange={event => setEditing(prev => (prev ? { ...prev, category: event.target.value } : prev))}
                        placeholder="category"
                        className="w-full rounded-md border border-[#dec2d0] px-2 py-1 text-xs text-[#4f3040] focus:outline-none focus:ring-2 focus:ring-[#f2aacb]"
                      />
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={saveEdit}
                          disabled={savingObjectName === item.objectName}
                          className="flex-1 inline-flex items-center justify-center gap-1 text-[11px] px-2 py-1 rounded-md border border-green-200 text-green-700 hover:bg-green-50 disabled:opacity-60"
                        >
                          <Check className="w-3 h-3" />
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          disabled={savingObjectName === item.objectName}
                          className="inline-flex items-center justify-center text-[11px] px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-60"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs font-medium text-gray-700 truncate" title={item.name}>
                      {item.name}
                    </p>
                  )}

                  <p className="mt-1.5 text-[10px] font-mono text-[#8b6f7d] truncate" title={item.objectName || '-'}>
                    {item.objectName || '-'}
                  </p>
                </div>
                )
              })}
            </div>
          )}

          <div className="mt-5 text-xs text-[#705362] flex items-center">
            <StickerIcon className="w-3.5 h-3.5 mr-1.5" />
            Tip: use transparent PNG files for cleaner photobooth sticker results.
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(confirmDeleteItem)}
        title="Delete Sticker"
        message={confirmDeleteItem ? `Delete sticker ${confirmDeleteItem.name}?` : ''}
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
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
