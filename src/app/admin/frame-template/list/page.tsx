'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Image as ImageIcon, RefreshCw, Trash2 } from 'lucide-react'
import ConfirmDialog from '@/components/ConfirmDialog'

type FrameTemplateItem = {
  name: string
  frameUrl: string
  stickerUrl: string
}

export default function FrameTemplateListPage() {
  const { data: session, status } = useSession()

  const [templates, setTemplates] = useState<FrameTemplateItem[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [deletingName, setDeletingName] = useState<string | null>(null)
  const [confirmDeleteName, setConfirmDeleteName] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchTemplates = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true)
    } else {
      setLoadingList(true)
    }

    try {
      const res = await fetch('/api/list-frame-template', { cache: 'no-store' })
      const data = await res.json()
      setTemplates(Array.isArray(data.templates) ? data.templates : [])
    } catch {
      setMessage({ type: 'error', text: 'Gagal memuat daftar frame template.' })
    } finally {
      setLoadingList(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  const handleDelete = async (templateName: string) => {
    setDeletingName(templateName)
    setMessage(null)

    try {
      const res = await fetch(`/api/delete-frame-template?name=${encodeURIComponent(templateName)}`, {
        method: 'DELETE',
      })
      const data = await res.json()

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Gagal menghapus frame template.' })
        return
      }

      setMessage({ type: 'success', text: `Template ${templateName} berhasil dihapus.` })
      setTemplates(prev => prev.filter(item => item.name !== templateName))
      window.dispatchEvent(new Event('frameTemplatesUpdated'))
    } catch {
      setMessage({ type: 'error', text: 'Terjadi error saat menghapus template.' })
    } finally {
      setDeletingName(null)
      setConfirmDeleteName(null)
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
            <h1 className="text-3xl sm:text-4xl font-bold text-[#4f3040]">Daftar Template</h1>
            <p className="text-sm sm:text-base text-[#705362] mt-1">Kelola semua template yang sudah dibuat dari canvas.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/frame-template"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-[#e7a0c2] text-[#6d3f55] bg-[#fff3f9] hover:bg-[#ffe7f2] transition"
            >
              + Buat Template
            </Link>
            <button
              type="button"
              onClick={() => fetchTemplates(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-[#e7a0c2] text-[#6d3f55] bg-[#fff3f9] hover:bg-[#ffe7f2] transition disabled:opacity-60"
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

        <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-[#f3d7e5]">
          {loadingList ? (
            <p className="text-sm text-gray-500">Memuat data template...</p>
          ) : templates.length === 0 ? (
            <p className="text-sm text-gray-500">Belum ada frame template.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map(template => (
                <div key={template.name} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-gray-800 truncate pr-2">{template.name}</p>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteName(template.name)}
                      disabled={deletingName === template.name}
                      className="inline-flex items-center text-xs px-2.5 py-1.5 rounded-md border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-60"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      {deletingName === template.name ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-gray-50 border border-gray-100 p-2">
                      <p className="text-[11px] text-gray-500 mb-1">Frame</p>
                      <div className="aspect-square rounded-md overflow-hidden bg-white border border-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={template.frameUrl} alt={`${template.name} frame`} className="w-full h-full object-contain" />
                      </div>
                    </div>
                    <div className="rounded-lg bg-gray-50 border border-gray-100 p-2">
                      <p className="text-[11px] text-gray-500 mb-1">Sticker</p>
                      <div className="aspect-square rounded-md overflow-hidden bg-white border border-gray-100 flex items-center justify-center">
                        {template.stickerUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={template.stickerUrl} alt={`${template.name} sticker`} className="w-full h-full object-contain" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-gray-300" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(confirmDeleteName)}
        title="Hapus Template"
        message={confirmDeleteName ? `Hapus template ${confirmDeleteName}?` : ''}
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        loading={Boolean(deletingName)}
        onCancel={() => {
          if (!deletingName) setConfirmDeleteName(null)
        }}
        onConfirm={() => {
          if (!confirmDeleteName) return
          handleDelete(confirmDeleteName)
        }}
      />
    </div>
  )
}
