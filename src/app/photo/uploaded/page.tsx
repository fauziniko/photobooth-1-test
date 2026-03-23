'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Trash2, ChevronDown, AlertCircle, ImagePlus, ArrowRight } from 'lucide-react'
import ConfirmDialog from '@/components/ConfirmDialog'
import {
  isIndexedDBSupported,
  loadPhotosFromIndexedDB,
  savePhotosToIndexedDB,
} from '@/lib/indexedDB'
import {
  loadTempPhotosFromSessionStorage,
  saveTempPhotosToSessionStorage,
  clearTempPhotosFromSessionStorage,
} from '@/lib/tempPhotoStorage'

const isValidPhotoData = (value: string) =>
  typeof value === 'string' && value.startsWith('data:image/') && value.length > 1000

export default function UploadedPhotosPage() {
  const router = useRouter()
  const [photos, setPhotos] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [layout, setLayout] = useState(4)
  const [error, setError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<
    | { open: false }
    | { open: true; mode: 'single'; index: number }
    | { open: true; mode: 'all' }
  >({ open: false })

  useEffect(() => {
    // Load from query params
    const params = new URLSearchParams(window.location.search)
    const layoutParam = Number(params.get('layout'))
    if (Number.isFinite(layoutParam) && layoutParam >= 1) {
      setLayout(layoutParam)
    }

    const loadSavedPhotos = async () => {
      let savedPhotos: string[] = []

      if (isIndexedDBSupported()) {
        try {
          const cached = await loadPhotosFromIndexedDB()
          savedPhotos = cached.filter(isValidPhotoData)
        } catch (dbErr) {
          console.error('Failed to load photos from IndexedDB:', dbErr)
        }
      }

      if (savedPhotos.length === 0) {
        try {
          savedPhotos = loadTempPhotosFromSessionStorage().filter(isValidPhotoData)
        } catch (sessionErr) {
          console.error('Failed to load photos from session storage:', sessionErr)
        }
      }

      if (savedPhotos.length > 0) {
        setPhotos(savedPhotos)
      }
    }

    void loadSavedPhotos()
  }, [])

  // Keep uploaded photos in the same stores used by /photo -> /photo/edit flow.
  useEffect(() => {
    const persistPhotos = async () => {
      if (photos.length === 0) {
        clearTempPhotosFromSessionStorage()
        setError(null)
        return
      }

      let persisted = false

      try {
        if (isIndexedDBSupported()) {
          await savePhotosToIndexedDB(photos)
          persisted = true
        }
      } catch (dbErr) {
        console.error('Failed to save photos to IndexedDB:', dbErr)
      }

      const savedToSession = saveTempPhotosToSessionStorage(photos)
      if (savedToSession) {
        persisted = true
      }

      if (persisted) {
        setError(null)
      } else {
        setError('Storage is full. Unable to persist photos on this device.')
      }
    }

    void persistPhotos()
  }, [photos])

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return
    
    setError(null)
    Array.from(files).forEach((file) => {
      // Check file size (limit to 5MB per file)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        setError(`File ${file.name} is too large (maximum 5MB).`)
        return
      }
      
      const reader = new FileReader()
      reader.onerror = () => {
        setError(`Failed to read file ${file.name}.`)
      }
      reader.onload = (e) => {
        try {
          const result = e.target?.result as string
          if (!isValidPhotoData(result)) {
            setError(`Unsupported image format for ${file.name}.`)
            return
          }

          setPhotos((prev) => [...prev, result])
        } catch (fileErr) {
          console.error('Failed to process file:', fileErr)
          setError('Failed to process file.')
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const deletePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const requestDeleteAll = () => {
    if (photos.length === 0) return
    setConfirmDelete({ open: true, mode: 'all' })
  }

  const requestDeleteSingle = (index: number) => {
    setConfirmDelete({ open: true, mode: 'single', index })
  }

  const closeDeleteDialog = () => {
    setConfirmDelete({ open: false })
  }

  const confirmDeleteAction = () => {
    if (!confirmDelete.open) return

    if (confirmDelete.mode === 'all') {
      setPhotos([])
    } else {
      deletePhoto(confirmDelete.index)
    }

    closeDeleteDialog()
  }

  const goToEditor = async () => {
    if (photos.length >= layout) {
      try {
        if (isIndexedDBSupported()) {
          await savePhotosToIndexedDB(photos)
        }
      } catch (dbErr) {
        console.error('Failed to persist before navigation:', dbErr)
      }

      saveTempPhotosToSessionStorage(photos)
      router.push(`/photo/edit?layout=${layout}`)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fff7fb] to-white pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Step Counter */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold">
            <span className="text-[#d72688]">Step 1 of 3:</span>
            <span className="text-gray-700"> Upload Photos</span>
          </h1>
        </div>

        {/* Layout Selector */}
        <div className="flex justify-center mb-8">
          <div className="relative inline-block">
            <select
              value={layout}
              onChange={(e) => setLayout(Number(e.target.value))}
              className="appearance-none px-6 py-3 border-2 border-[#f3b7d1] rounded-xl text-[#d72688] font-semibold bg-white cursor-pointer pr-12 focus:outline-none focus:border-[#ec6aa9]"
            >
              <option value={2}>2 Pose</option>
              <option value={3}>3 Pose</option>
              <option value={4}>4 Pose</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#d72688] pointer-events-none" size={20} />
          </div>
        </div>

        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`mb-12 border-3 border-dashed rounded-2xl p-10 text-center transition ${
            isDragging
              ? 'border-[#fa75aa] bg-[#fff0f7]'
              : 'border-[#f3b7d1] bg-white'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-[#f28bbc] flex items-center justify-center">
              <Upload size={40} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#5a2a42] mb-2">Choose or Drag Photos</h2>
              <p className="text-gray-600 mb-6">Upload your photos here or click the button below</p>
              <label className="inline-flex items-center px-8 py-3 bg-[#f28bbc] text-white font-semibold rounded-lg cursor-pointer hover:bg-[#ec6aa9] transition">
                <ImagePlus size={18} className="mr-2" />
                Choose Files
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files)}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Photos Preview */}
        {photos.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#5a2a42]">
                {photos.length} / {layout} Photos
              </h2>
              {photos.length > 0 && (
                <button
                  onClick={requestDeleteAll}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-medium"
                >
                  <Trash2 size={16} />
                  Remove All
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
              {photos.map((photo, idx) => (
                <div
                  key={`${idx}-${photo.slice(0, 20)}`}
                  className="group relative aspect-square overflow-hidden rounded-xl shadow-md hover:shadow-lg transition"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo}
                    alt={`photo-${idx}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Photo number */}
                  <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-[#fa75aa] text-white flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </div>
                  {/* Delete overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center">
                    <button
                      onClick={() => requestDeleteSingle(idx)}
                      className="opacity-0 group-hover:opacity-100 transition p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                      title="Remove photo"
                      aria-label={`Remove photo ${idx + 1}`}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Proceed Button */}
            <div className="flex justify-center">
              <button
                onClick={goToEditor}
                disabled={photos.length < layout}
                className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition ${
                  photos.length >= layout
                    ? 'bg-[#fa75aa] text-white hover:bg-[#ec6aa9] active:scale-95'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {photos.length >= layout && <ArrowRight size={20} />}
                {photos.length >= layout
                  ? `Continue to Editor (${photos.length}/${layout})`
                  : `Need ${layout - photos.length} more photo(s)`}
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {photos.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-500 mb-2">No photos yet</h3>
            <p className="text-gray-400">Upload at least {layout} photos to continue</p>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmDelete.open}
        title={confirmDelete.open && confirmDelete.mode === 'all' ? 'Remove All Photos' : 'Remove Photo'}
        message={
          confirmDelete.open && confirmDelete.mode === 'all'
            ? 'Are you sure you want to remove all uploaded photos? This action cannot be undone.'
            : 'Are you sure you want to remove this photo?'
        }
        confirmLabel="Yes, Remove"
        cancelLabel="Cancel"
        onCancel={closeDeleteDialog}
        onConfirm={confirmDeleteAction}
      />
    </main>
  )
}
