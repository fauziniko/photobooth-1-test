'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  clearTempLiveVideoUrlFromSessionStorage,
  saveTempPhotosToSessionStorage,
} from '@/lib/tempPhotoStorage'
import {
  isIndexedDBSupported,
  savePhotosToIndexedDB,
} from '@/lib/indexedDB'

const isValidPhotoData = (value: string) =>
  typeof value === 'string' && value.startsWith('data:image/') && value.length > 1000

export default function UploadPhotosPage() {
  const router = useRouter()
  const [layout, setLayout] = useState(4)
  const [photos, setPhotos] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const readFilesAsDataUrl = async (files: File[]) => {
    const readers = files.map(
      file =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
    )

    return Promise.all(readers)
  }

  const handlePickFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : []
    if (files.length === 0) return

    setError(null)

    if (files.length > layout) {
      setError(`You can upload up to ${layout} photos for ${layout} pose layout.`)
      event.target.value = ''
      return
    }

    try {
      const base64 = await readFilesAsDataUrl(files)
      const valid = base64.filter(isValidPhotoData).slice(0, layout)

      if (valid.length === 0) {
        setError('No valid image files were selected.')
        return
      }

      setPhotos(valid)
    } catch {
      setError('Failed to read selected files.')
    } finally {
      event.target.value = ''
    }
  }

  const handleContinue = async () => {
    if (photos.length === 0) {
      setError('Please upload at least one photo.')
      return
    }

    setSaving(true)
    setError(null)

    try {
      clearTempLiveVideoUrlFromSessionStorage()
      saveTempPhotosToSessionStorage(photos)

      if (isIndexedDBSupported()) {
        await savePhotosToIndexedDB(photos)
      }

      router.push(`/photo/edit?layout=${layout}`)
    } catch {
      setError('Failed to save uploaded photos. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="pb-page-bg min-h-screen w-full px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-[#f3b7d1] bg-[#fff7fb] p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#d72688] text-left">Upload Photos</h1>
        <p className="mt-1 text-sm text-[#8c295c] text-left">Upload photos from this dedicated page, then continue to editor.</p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-3 items-center">
          <label className="text-sm font-medium text-[#5a2a42]">Pose Layout</label>
          <select
            value={layout}
            onChange={event => setLayout(Number(event.target.value))}
            className="w-full rounded-xl border border-[#fa75aa] bg-white px-3 py-3 text-sm text-[#d72688] font-medium outline-none"
          >
            <option value={2}>2 Pose</option>
            <option value={3}>3 Pose</option>
            <option value={4}>4 Pose</option>
          </select>
        </div>

        <div className="mt-4">
          <label
            htmlFor="upload-photo-page"
            className="w-full inline-flex items-center justify-center rounded-xl border border-[#fa75aa] bg-white text-[#d72688] font-medium text-sm px-3 py-3 hover:bg-[#fff4fa] transition cursor-pointer"
          >
            Upload Images ({layout} max)
          </label>
          <input
            id="upload-photo-page"
            type="file"
            accept="image/*"
            multiple
            onChange={handlePickFiles}
            className="hidden"
          />
        </div>

        {error && (
          <div className="mt-3 rounded-lg border border-[#f3b7d1] bg-[#fff4fa] px-3 py-2 text-xs text-[#8c295c]">
            {error}
          </div>
        )}

        <div className="mt-4">
          <p className="text-left text-xs font-semibold text-[#7b4d64] mb-2">Uploaded Photos</p>
          {photos.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#f3b7d1] px-3 py-5 text-xs text-[#9b6f85]">
              No uploaded photos yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {photos.map((src, idx) => (
                <div key={idx} className="rounded-lg overflow-hidden border border-[#f3d7e5] bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`uploaded-${idx}`} className="w-full aspect-[4/3] object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleContinue}
          disabled={saving || photos.length === 0}
          className="mt-5 w-full rounded-xl bg-[#fa75aa] text-white font-semibold py-3 hover:bg-[#d72688] disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Continue to Editor'}
        </button>
      </div>
    </main>
  )
}
