'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Upload, Trash2, RefreshCw, Image as ImageIcon } from 'lucide-react'

type FrameTemplateItem = {
  name: string
  frameUrl: string
  stickerUrl: string
}

export default function FrameTemplatePage() {
  const { data: session, status } = useSession()

  const [templates, setTemplates] = useState<FrameTemplateItem[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deletingName, setDeletingName] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [name, setName] = useState('')
  const [frameFile, setFrameFile] = useState<File | null>(null)
  const [stickerFile, setStickerFile] = useState<File | null>(null)

  const fetchTemplates = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true)
    } else {
      setLoadingList(true)
    }

    try {
      const res = await fetch('/api/list-frame-template')
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

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)

    if (!frameFile || !stickerFile) {
      setMessage({ type: 'error', text: 'Frame dan sticker file wajib diisi.' })
      return
    }

    if (frameFile.type !== 'image/png' || stickerFile.type !== 'image/png') {
      setMessage({ type: 'error', text: 'File frame dan sticker harus PNG.' })
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('name', name.trim() || `template_${Date.now()}`)
      formData.append('frame', frameFile)
      formData.append('sticker', stickerFile)

      const res = await fetch('/api/upload-frame-template', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Upload frame template gagal.' })
        return
      }

      setMessage({ type: 'success', text: 'Frame template berhasil dibuat.' })
      setName('')
      setFrameFile(null)
      setStickerFile(null)
      event.currentTarget.reset()
      fetchTemplates(true)
      window.dispatchEvent(new Event('frameTemplatesUpdated'))
    } catch {
      setMessage({ type: 'error', text: 'Terjadi error saat upload frame template.' })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (templateName: string) => {
    const shouldDelete = window.confirm(`Hapus template ${templateName}?`)
    if (!shouldDelete) return

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
            <h1 className="text-3xl sm:text-4xl font-bold text-[#4f3040]">Frame Template</h1>
            <p className="text-sm sm:text-base text-[#705362] mt-1">Lihat, buat, dan hapus frame template kustom.</p>
          </div>
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
            <h2 className="text-xl font-semibold text-[#4f3040] mb-4">Buat Template Baru</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label htmlFor="template-name" className="block text-sm font-medium text-[#5d4150] mb-1">
                  Nama Template
                </label>
                <input
                  id="template-name"
                  type="text"
                  value={name}
                  onChange={event => setName(event.target.value)}
                  placeholder="contoh: birthday-pink"
                  className="w-full rounded-lg border border-[#d9c8d1] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f2aacb]"
                />
              </div>

              <div>
                <label htmlFor="frame-file" className="block text-sm font-medium text-[#5d4150] mb-1">
                  File Frame (PNG)
                </label>
                <input
                  id="frame-file"
                  type="file"
                  accept="image/png"
                  onChange={event => setFrameFile(event.target.files?.[0] || null)}
                  required
                  className="w-full text-sm border border-[#d9c8d1] rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label htmlFor="sticker-file" className="block text-sm font-medium text-[#5d4150] mb-1">
                  File Sticker (PNG)
                </label>
                <input
                  id="sticker-file"
                  type="file"
                  accept="image/png"
                  onChange={event => setStickerFile(event.target.files?.[0] || null)}
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
                {uploading ? 'Uploading...' : 'Simpan Template'}
              </button>
            </form>
          </div>

          <div className="xl:col-span-2 bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-[#f3d7e5]">
            <h2 className="text-xl font-semibold text-[#4f3040] mb-4">Daftar Template</h2>

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
                        onClick={() => handleDelete(template.name)}
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
      </div>
    </div>
  )
}
