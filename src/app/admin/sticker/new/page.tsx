'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Circle, Eraser, PencilLine, Square, Triangle, Upload } from 'lucide-react'

type MessageState = {
  type: 'success' | 'error'
  text: string
} | null

type ShapeKind = 'square' | 'triangle' | 'circle'

type CanvasShape = {
  id: string
  kind: ShapeKind
  x: number
  y: number
  size: number
  color: string
}

const CANVAS_SIZE = 512
const SHAPE_DRAG_TYPE = 'application/photobooth-shape'

const pointFromEvent = (canvas: HTMLCanvasElement, clientX: number, clientY: number) => {
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  }
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

const drawShapeOnContext = (ctx: CanvasRenderingContext2D, shape: CanvasShape) => {
  const half = shape.size / 2
  const centerX = shape.x + half
  const centerY = shape.y + half

  ctx.save()
  ctx.fillStyle = shape.color

  if (shape.kind === 'square') {
    ctx.fillRect(shape.x, shape.y, shape.size, shape.size)
  }

  if (shape.kind === 'circle') {
    ctx.beginPath()
    ctx.arc(centerX, centerY, half, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()
  }

  if (shape.kind === 'triangle') {
    ctx.beginPath()
    ctx.moveTo(centerX, shape.y)
    ctx.lineTo(shape.x + shape.size, shape.y + shape.size)
    ctx.lineTo(shape.x, shape.y + shape.size)
    ctx.closePath()
    ctx.fill()
  }

  ctx.restore()
}

export default function NewStickerPage() {
  const { data: session, status } = useSession()

  const [message, setMessage] = useState<MessageState>(null)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('custom')
  const [file, setFile] = useState<File | null>(null)
  const [stickerPreviewUrl, setStickerPreviewUrl] = useState<string | null>(null)
  const [isDraggingSticker, setIsDraggingSticker] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [drawColor, setDrawColor] = useState('#111111')
  const [brushSize, setBrushSize] = useState(8)
  const [shapeSize, setShapeSize] = useState(140)
  const [isDrawing, setIsDrawing] = useState(false)
  const [shapes, setShapes] = useState<CanvasShape[]>([])
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null)

  const stickerInputRef = useRef<HTMLInputElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const canvasWrapRef = useRef<HTMLDivElement | null>(null)
  const shapeDragStateRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null)

  useEffect(() => {
    if (!file) {
      setStickerPreviewUrl(null)
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setStickerPreviewUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }, [])

  const drawAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const point = pointFromEvent(canvas, clientX, clientY)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = drawColor
    ctx.lineWidth = brushSize
    ctx.lineTo(point.x, point.y)
    ctx.stroke()
  }

  const handleCanvasPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    event.preventDefault()
    canvas.setPointerCapture(event.pointerId)
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const point = pointFromEvent(canvas, event.clientX, event.clientY)
    ctx.beginPath()
    ctx.moveTo(point.x, point.y)
    setIsDrawing(true)
  }

  const handleCanvasPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    event.preventDefault()
    drawAt(event.clientX, event.clientY)
  }

  const stopDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return

    event.preventDefault()
    if (canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId)
    }

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.closePath()
    }

    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setShapes([])
    setSelectedShapeId(null)
    setMessage({ type: 'success', text: 'Canvas dibersihkan.' })
  }

  const addShape = (kind: ShapeKind, at?: { x: number; y: number }) => {
    const size = Math.max(20, shapeSize)
    const x = clamp(at?.x ?? (CANVAS_SIZE - size) / 2, 0, CANVAS_SIZE - size)
    const y = clamp(at?.y ?? (CANVAS_SIZE - size) / 2, 0, CANVAS_SIZE - size)
    const next: CanvasShape = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      kind,
      x,
      y,
      size,
      color: drawColor,
    }
    setShapes(prev => [...prev, next])
    setSelectedShapeId(next.id)
  }

  const handleShapeDragStart = (kind: ShapeKind) => (event: React.DragEvent<HTMLButtonElement>) => {
    event.dataTransfer.setData(SHAPE_DRAG_TYPE, kind)
    event.dataTransfer.effectAllowed = 'copy'
  }

  const handleCanvasDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
  }

  const handleCanvasDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const raw = event.dataTransfer.getData(SHAPE_DRAG_TYPE)
    if (raw !== 'square' && raw !== 'triangle' && raw !== 'circle') return

    const wrap = canvasWrapRef.current
    if (!wrap) return
    const bounds = wrap.getBoundingClientRect()
    const scaleX = CANVAS_SIZE / bounds.width
    const scaleY = CANVAS_SIZE / bounds.height
    const size = Math.max(20, shapeSize)
    const x = (event.clientX - bounds.left) * scaleX - size / 2
    const y = (event.clientY - bounds.top) * scaleY - size / 2
    addShape(raw, { x, y })
  }

  const handleShapePointerDown = (shapeId: string) => (event: React.PointerEvent<HTMLDivElement>) => {
    const wrap = canvasWrapRef.current
    const shape = shapes.find(item => item.id === shapeId)
    if (!wrap || !shape) return

    event.preventDefault()
    event.stopPropagation()

    const bounds = wrap.getBoundingClientRect()
    const scaleX = CANVAS_SIZE / bounds.width
    const scaleY = CANVAS_SIZE / bounds.height

    shapeDragStateRef.current = {
      id: shapeId,
      offsetX: (event.clientX - bounds.left) * scaleX - shape.x,
      offsetY: (event.clientY - bounds.top) * scaleY - shape.y,
    }
    setSelectedShapeId(shapeId)
  }

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      const state = shapeDragStateRef.current
      const wrap = canvasWrapRef.current
      if (!state || !wrap) return

      setShapes(prev =>
        prev.map(shape => {
          if (shape.id !== state.id) return shape
          const bounds = wrap.getBoundingClientRect()
          const scaleX = CANVAS_SIZE / bounds.width
          const scaleY = CANVAS_SIZE / bounds.height
          const x = (event.clientX - bounds.left) * scaleX - state.offsetX
          const y = (event.clientY - bounds.top) * scaleY - state.offsetY
          return {
            ...shape,
            x: clamp(x, 0, CANVAS_SIZE - shape.size),
            y: clamp(y, 0, CANVAS_SIZE - shape.size),
          }
        })
      )
    }

    const stopDrag = () => {
      shapeDragStateRef.current = null
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', stopDrag)
    window.addEventListener('pointercancel', stopDrag)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', stopDrag)
      window.removeEventListener('pointercancel', stopDrag)
    }
  }, [])

  const useCanvasAsStickerFile = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const exportCanvas = document.createElement('canvas')
    exportCanvas.width = canvas.width
    exportCanvas.height = canvas.height
    const exportCtx = exportCanvas.getContext('2d')
    if (!exportCtx) {
      setMessage({ type: 'error', text: 'Gagal menyiapkan canvas export.' })
      return
    }

    exportCtx.clearRect(0, 0, exportCanvas.width, exportCanvas.height)
    exportCtx.drawImage(canvas, 0, 0)
    for (const shape of shapes) {
      drawShapeOnContext(exportCtx, shape)
    }

    const blob = await new Promise<Blob | null>(resolve => exportCanvas.toBlob(resolve, 'image/png'))
    if (!blob) {
      setMessage({ type: 'error', text: 'Gagal membuat sticker dari canvas.' })
      return
    }

    const hasInk = blob.size > 1200
    if (!hasInk) {
      setMessage({ type: 'error', text: 'Canvas masih kosong. Gambar dulu sebelum dipakai sebagai sticker.' })
      return
    }

    const nextName = name.trim() || `drawn-sticker-${Date.now()}`
    const canvasFile = new File([blob], `${nextName}.png`, { type: 'image/png' })
    setFile(canvasFile)
    setMessage({ type: 'success', text: 'Preview sticker diambil dari canvas.' })
  }

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

      const data = await res.json().catch(() => ({ error: 'Respons server tidak valid.' }))

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Upload sticker gagal.' })
        return
      }

      setMessage({ type: 'success', text: 'Sticker berhasil dibuat.' })
      setName('')
      setCategory('custom')
      setFile(null)
      formElement.reset()
      window.dispatchEvent(new Event('stickerLibraryUpdated'))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setMessage({ type: 'error', text: `Terjadi error saat upload sticker: ${errorMessage}` })
    } finally {
      setUploading(false)
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
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#4f3040]">Buat Sticker Baru</h1>
          <p className="text-sm sm:text-base text-[#705362] mt-1">
            Upload sticker atau gambar manual seperti tanda tangan dengan elemen bentuk dasar.
          </p>
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

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-[#f3d7e5]">
            <h2 className="text-xl font-semibold text-[#4f3040] mb-4">Canvas Sticker</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="text-sm text-[#5d4150] font-medium">
                  Warna Gambar
                  <input
                    type="color"
                    value={drawColor}
                    onChange={event => setDrawColor(event.target.value)}
                    className="mt-1 w-full h-10 rounded border border-[#d9c8d1]"
                  />
                </label>
                <label className="text-sm text-[#5d4150] font-medium">
                  Ukuran Brush
                  <input
                    type="range"
                    min={1}
                    max={28}
                    value={brushSize}
                    onChange={event => setBrushSize(Number(event.target.value))}
                    className="mt-3 w-full"
                  />
                </label>
                <label className="text-sm text-[#5d4150] font-medium">
                  Ukuran Bentuk
                  <input
                    type="range"
                    min={40}
                    max={260}
                    value={shapeSize}
                    onChange={event => setShapeSize(Number(event.target.value))}
                    className="mt-3 w-full"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <button
                  type="button"
                  draggable
                  onDragStart={handleShapeDragStart('square')}
                  onClick={() => addShape('square')}
                  className="inline-flex items-center justify-center gap-1 rounded-xl border border-[#e7a0c2] bg-[#fff3f9] px-3 py-2 text-sm text-[#6d3f55] hover:bg-[#ffe7f2] active:scale-[0.98] transition"
                >
                  <Square className="w-4 h-4" /> Persegi
                </button>
                <button
                  type="button"
                  draggable
                  onDragStart={handleShapeDragStart('triangle')}
                  onClick={() => addShape('triangle')}
                  className="inline-flex items-center justify-center gap-1 rounded-xl border border-[#e7a0c2] bg-[#fff3f9] px-3 py-2 text-sm text-[#6d3f55] hover:bg-[#ffe7f2] active:scale-[0.98] transition"
                >
                  <Triangle className="w-4 h-4" /> Segitiga
                </button>
                <button
                  type="button"
                  draggable
                  onDragStart={handleShapeDragStart('circle')}
                  onClick={() => addShape('circle')}
                  className="inline-flex items-center justify-center gap-1 rounded-xl border border-[#e7a0c2] bg-[#fff3f9] px-3 py-2 text-sm text-[#6d3f55] hover:bg-[#ffe7f2] active:scale-[0.98] transition"
                >
                  <Circle className="w-4 h-4" /> Lingkaran
                </button>
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="inline-flex items-center justify-center gap-1 rounded-lg border border-[#e7a0c2] bg-[#fff3f9] px-3 py-2 text-sm text-[#6d3f55] hover:bg-[#ffe7f2]"
                >
                  <Eraser className="w-4 h-4" /> Bersihkan
                </button>
                <button
                  type="button"
                  onClick={useCanvasAsStickerFile}
                  className="inline-flex items-center justify-center gap-1 rounded-lg border border-[#e7a0c2] bg-[#f8bfd7] px-3 py-2 text-sm text-[#4a2337] hover:bg-[#f2aacb]"
                >
                  <PencilLine className="w-4 h-4" /> Pakai Canvas
                </button>
              </div>

              <div className="rounded-xl border border-[#ecd4e1] bg-[#fff7fb] p-3">
                <div
                  ref={canvasWrapRef}
                  onDragOver={handleCanvasDragOver}
                  onDrop={handleCanvasDrop}
                  className="relative w-full max-w-[420px] aspect-square rounded-lg bg-white border border-[#f0e2e8] overflow-hidden"
                >
                  <canvas
                    ref={canvasRef}
                    width={CANVAS_SIZE}
                    height={CANVAS_SIZE}
                    onPointerDown={handleCanvasPointerDown}
                    onPointerMove={handleCanvasPointerMove}
                    onPointerUp={stopDrawing}
                    onPointerCancel={stopDrawing}
                    className="absolute inset-0 w-full h-full touch-none cursor-crosshair"
                  />

                  <div className="absolute inset-0">
                    {shapes.map(shape => {
                      const isSelected = shape.id === selectedShapeId
                      return (
                        <div
                          key={shape.id}
                          onPointerDown={handleShapePointerDown(shape.id)}
                          className={`absolute touch-none cursor-move select-none ${isSelected ? 'ring-2 ring-[#fa75aa]' : ''}`}
                          style={{
                            left: `${(shape.x / CANVAS_SIZE) * 100}%`,
                            top: `${(shape.y / CANVAS_SIZE) * 100}%`,
                            width: `${(shape.size / CANVAS_SIZE) * 100}%`,
                            height: `${(shape.size / CANVAS_SIZE) * 100}%`,
                          }}
                        >
                          {shape.kind === 'square' ? <div className="w-full h-full" style={{ backgroundColor: shape.color }} /> : null}
                          {shape.kind === 'circle' ? <div className="w-full h-full rounded-full" style={{ backgroundColor: shape.color }} /> : null}
                          {shape.kind === 'triangle' ? (
                            <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
                              <polygon points="50,0 100,100 0,100" fill={shape.color} />
                            </svg>
                          ) : null}
                        </div>
                      )
                    })}
                  </div>
                </div>
                <p className="text-xs text-[#705362] mt-2">
                  Gambar langsung dengan tangan, lalu shape bisa di-drag ke canvas dan digeser-geser.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 h-fit border border-[#f3d7e5]">
            <h2 className="text-xl font-semibold text-[#4f3040] mb-4">Upload Sticker</h2>
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
        </div>
      </div>
    </div>
  )
}
