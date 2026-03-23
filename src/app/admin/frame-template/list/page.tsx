'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Check, Image as ImageIcon, Pencil, RefreshCw, Trash2, X } from 'lucide-react'
import ConfirmDialog from '@/components/ConfirmDialog'

type FrameTemplateItem = {
  name: string
  frameUrl: string
  stickerUrl: string
  settings?: unknown
}

const normalizeTemplateName = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')

export default function FrameTemplateListPage() {
  const { data: session, status } = useSession()

  const [templates, setTemplates] = useState<FrameTemplateItem[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [deletingName, setDeletingName] = useState<string | null>(null)
  const [savingName, setSavingName] = useState<string | null>(null)
  const [confirmDeleteName, setConfirmDeleteName] = useState<string | null>(null)
  const [selectedTemplateName, setSelectedTemplateName] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [editing, setEditing] = useState<{
    currentName: string
    name: string
    frameFile: File | null
    stickerFile: File | null
  } | null>(null)

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
      setMessage({ type: 'error', text: 'Failed to load frame template list.' })
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
        setMessage({ type: 'error', text: data.error || 'Failed to delete frame template.' })
        return
      }

      setMessage({ type: 'success', text: `Template ${templateName} deleted successfully.` })
      setTemplates(prev => prev.filter(item => item.name !== templateName))
      window.dispatchEvent(new Event('frameTemplatesUpdated'))
    } catch {
      setMessage({ type: 'error', text: 'An error occurred while deleting template.' })
    } finally {
      setDeletingName(null)
      setConfirmDeleteName(null)
    }
  }

  const startEdit = (template: FrameTemplateItem) => {
    setSelectedTemplateName(template.name)
    setEditing({
      currentName: template.name,
      name: template.name,
      frameFile: null,
      stickerFile: null,
    })
    setMessage(null)
  }

  const cancelEdit = () => {
    if (savingName) return
    setEditing(null)
  }

  const handleSaveEdit = async (template: FrameTemplateItem) => {
    if (!editing || editing.currentName !== template.name) return

    const normalizedName = normalizeTemplateName(editing.name)
    if (!normalizedName) {
      setMessage({ type: 'error', text: 'Template name is invalid.' })
      return
    }

    const hasChanges =
      normalizedName !== template.name ||
      Boolean(editing.frameFile) ||
      Boolean(editing.stickerFile)

    if (!hasChanges) {
      setMessage({ type: 'error', text: 'No changes to save yet.' })
      return
    }

    setSavingName(template.name)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('currentName', template.name)
      formData.append('name', normalizedName)
      if (editing.frameFile) {
        formData.append('frame', editing.frameFile)
      }
      if (editing.stickerFile) {
        formData.append('sticker', editing.stickerFile)
      }
      if (template.settings) {
        formData.append('settings', JSON.stringify(template.settings))
      }

      const res = await fetch('/api/update-frame-template', {
        method: 'PATCH',
        body: formData,
      })
      const data = await res.json().catch(() => ({ error: 'Invalid server response.' }))

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Failed to update template.' })
        return
      }

      await fetchTemplates(true)
      setEditing(null)
      setMessage({ type: 'success', text: `Template ${template.name} updated successfully.` })
      window.dispatchEvent(new Event('frameTemplatesUpdated'))
    } catch {
      setMessage({ type: 'error', text: 'An error occurred while updating template.' })
    } finally {
      setSavingName(null)
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
            <h1 className="text-3xl sm:text-4xl font-bold text-[#4f3040]">Template List</h1>
            <p className="text-sm sm:text-base text-[#705362] mt-1">Manage all templates created from canvas.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/frame-template"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-[#e7a0c2] text-[#6d3f55] bg-[#fff3f9] hover:bg-[#ffe7f2] transition"
            >
              + Create Template
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
            <p className="text-sm text-gray-500">Loading templates...</p>
          ) : templates.length === 0 ? (
            <p className="text-sm text-gray-500">No frame templates available yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map(template => {
                const isEditing = editing?.currentName === template.name
                const isSelected = selectedTemplateName === template.name

                return (
                <div
                  key={template.name}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedTemplateName(template.name)}
                  onKeyDown={event => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setSelectedTemplateName(template.name)
                    }
                  }}
                  className={`border rounded-xl p-4 transition ${
                    isSelected ? 'border-[#e7a0c2] bg-[#fff8fc]' : 'border-gray-200 bg-white hover:border-[#edd7e2]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    {isEditing ? (
                      <div className="w-full space-y-1">
                        <p className="text-[11px] text-[#7f5d6d]">Template Name (slug)</p>
                        <input
                          type="text"
                          value={editing.name}
                          onChange={event => setEditing(prev => (prev ? { ...prev, name: event.target.value } : prev))}
                          className="w-full rounded-md border border-[#e0c6d4] px-3 py-2 text-sm text-[#4f3040] focus:outline-none focus:ring-2 focus:ring-[#f2aacb]"
                        />
                      </div>
                    ) : (
                      <p className="font-semibold text-gray-800 truncate pr-2">{template.name}</p>
                    )}

                    <div className="flex items-center gap-1.5 ml-2">
                      {isSelected && !isEditing && (
                        <Link
                          href={`/admin/frame-template?edit=${encodeURIComponent(template.name)}`}
                          className="inline-flex items-center text-xs px-2.5 py-1.5 rounded-md border border-[#f3b7d1] text-[#a2356c] hover:bg-[#fff1f8]"
                        >
                          Edit Canvas
                        </Link>
                      )}

                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(template)}
                            disabled={savingName === template.name}
                            className="inline-flex items-center text-xs px-2.5 py-1.5 rounded-md border border-green-200 text-green-700 hover:bg-green-50 disabled:opacity-60"
                          >
                            <Check className="w-3.5 h-3.5 mr-1" />
                            {savingName === template.name ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            disabled={savingName === template.name}
                            className="inline-flex items-center text-xs px-2.5 py-1.5 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : isSelected ? (
                        <button
                          type="button"
                          onClick={() => startEdit(template)}
                          disabled={Boolean(deletingName || savingName)}
                          className="inline-flex items-center text-xs px-2.5 py-1.5 rounded-md border border-amber-200 text-amber-700 hover:bg-amber-50 disabled:opacity-60"
                        >
                          <Pencil className="w-3.5 h-3.5 mr-1" />
                          Edit
                        </button>
                      ) : null}

                      {isSelected && (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteName(template.name)}
                          disabled={deletingName === template.name || savingName === template.name}
                          className="inline-flex items-center text-xs px-2.5 py-1.5 rounded-md border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-60"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" />
                          {deletingName === template.name ? 'Deleting...' : 'Delete'}
                        </button>
                      )}
                    </div>
                  </div>

                  {!isSelected && !isEditing && (
                    <p className="mb-3 text-[11px] text-[#8b6b7b]">Select this template to show actions.</p>
                  )}

                  {isEditing && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 p-3 rounded-lg border border-[#eed6e3] bg-[#fff8fc]">
                      <label className="text-xs text-[#6e4f5f]">
                        Replace Frame (optional PNG)
                        <input
                          type="file"
                          accept="image/png"
                          onChange={event => {
                            const next = event.target.files?.[0] || null
                            setEditing(prev => (prev ? { ...prev, frameFile: next } : prev))
                          }}
                          className="mt-1 block w-full text-xs"
                        />
                        <span className="block mt-1 text-[11px] text-[#8e6f7f] truncate">
                          {editing.frameFile ? editing.frameFile.name : 'Keep current frame'}
                        </span>
                      </label>
                      <label className="text-xs text-[#6e4f5f]">
                        Replace Sticker (optional PNG)
                        <input
                          type="file"
                          accept="image/png"
                          onChange={event => {
                            const next = event.target.files?.[0] || null
                            setEditing(prev => (prev ? { ...prev, stickerFile: next } : prev))
                          }}
                          className="mt-1 block w-full text-xs"
                        />
                        <span className="block mt-1 text-[11px] text-[#8e6f7f] truncate">
                          {editing.stickerFile ? editing.stickerFile.name : 'Keep current sticker'}
                        </span>
                      </label>
                    </div>
                  )}

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
                )
              })}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(confirmDeleteName)}
        title="Delete Template"
        message={confirmDeleteName ? `Delete template ${confirmDeleteName}?` : ''}
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
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
