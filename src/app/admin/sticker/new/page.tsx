'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import ConfirmDialog from '../../../../../components/ConfirmDialog'
import {
  Clipboard,
  Eraser,
  Link2,
  List,
  PencilLine,
  Search,
  Smile,
  Trash2,
  Undo2,
  Upload,
  WandSparkles,
} from 'lucide-react'

type MessageState = {
  type: 'success' | 'error'
  text: string
} | null

type ShapeKind = 'square' | 'triangle' | 'circle' | 'diamond' | 'star' | 'pentagon' | 'hexagon' | 'heart' | 'plus' | 'cloud'

type CanvasShape = {
  id: string
  kind: ShapeKind
  x: number
  y: number
  size: number
  color: string
}

type StickerSearchProvider = 'iconify' | 'openmoji'

type StickerSearchItem = {
  id: string
  provider: StickerSearchProvider
  name: string
  previewUrl: string
  sourceUrl: string
}

const CANVAS_SIZE = 512
const SHAPE_DRAG_TYPE = 'application/photobooth-shape'
const MAX_FILE_SIZE = 5 * 1024 * 1024
const PRESET_CATEGORIES = ['custom', 'wedding', 'birthday', 'fun', 'kids', 'event']
const SHAPE_LIBRARY: Array<{ kind: ShapeKind; label: string; keywords: string[] }> = [
  { kind: 'square', label: 'Square', keywords: ['box', 'rectangle'] },
  { kind: 'triangle', label: 'Triangle', keywords: ['polygon'] },
  { kind: 'circle', label: 'Circle', keywords: ['round'] },
  { kind: 'diamond', label: 'Diamond', keywords: ['rhombus'] },
  { kind: 'star', label: 'Star', keywords: ['sparkle'] },
  { kind: 'pentagon', label: 'Pentagon', keywords: ['five'] },
  { kind: 'hexagon', label: 'Hexagon', keywords: ['six'] },
  { kind: 'heart', label: 'Heart', keywords: ['love'] },
  { kind: 'plus', label: 'Plus', keywords: ['cross'] },
  { kind: 'cloud', label: 'Cloud', keywords: ['bubble'] },
]

const extractCategoryFromObjectName = (objectName?: string) => {
  const parts = String(objectName || '').split('/')
  return parts[1] || ''
}

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

const toSafeValue = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')

const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(2)} MB`
}

const normalizeExternalImageUrl = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''

  if (value.startsWith('/api/image-proxy?url=')) return value

  try {
    const parsed = new URL(value)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return `/api/image-proxy?url=${encodeURIComponent(parsed.toString())}`
    }
  } catch {
    return ''
  }

  return ''
}

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(`Failed loading image: ${src}`))
    image.src = src
  })
}

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

  if (shape.kind === 'diamond') {
    ctx.beginPath()
    ctx.moveTo(centerX, shape.y)
    ctx.lineTo(shape.x + shape.size, centerY)
    ctx.lineTo(centerX, shape.y + shape.size)
    ctx.lineTo(shape.x, centerY)
    ctx.closePath()
    ctx.fill()
  }

  if (shape.kind === 'star') {
    const outer = half
    const inner = outer * 0.45
    ctx.beginPath()
    for (let i = 0; i < 10; i += 1) {
      const radius = i % 2 === 0 ? outer : inner
      const angle = -Math.PI / 2 + (Math.PI / 5) * i
      const px = centerX + Math.cos(angle) * radius
      const py = centerY + Math.sin(angle) * radius
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.fill()
  }

  if (shape.kind === 'pentagon' || shape.kind === 'hexagon') {
    const sides = shape.kind === 'pentagon' ? 5 : 6
    ctx.beginPath()
    for (let i = 0; i < sides; i += 1) {
      const angle = -Math.PI / 2 + (Math.PI * 2 * i) / sides
      const px = centerX + Math.cos(angle) * half
      const py = centerY + Math.sin(angle) * half
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.fill()
  }

  if (shape.kind === 'heart') {
    const topCurveHeight = shape.size * 0.3
    ctx.beginPath()
    ctx.moveTo(centerX, shape.y + shape.size)
    ctx.bezierCurveTo(shape.x + shape.size, shape.y + shape.size * 0.7, shape.x + shape.size, shape.y + topCurveHeight, centerX, shape.y + topCurveHeight)
    ctx.bezierCurveTo(shape.x, shape.y + topCurveHeight, shape.x, shape.y + shape.size * 0.7, centerX, shape.y + shape.size)
    ctx.closePath()
    ctx.fill()
  }

  if (shape.kind === 'plus') {
    const thickness = shape.size * 0.32
    const armOffset = (shape.size - thickness) / 2
    ctx.fillRect(shape.x + armOffset, shape.y, thickness, shape.size)
    ctx.fillRect(shape.x, shape.y + armOffset, shape.size, thickness)
  }

  if (shape.kind === 'cloud') {
    ctx.beginPath()
    ctx.arc(shape.x + shape.size * 0.33, shape.y + shape.size * 0.58, shape.size * 0.22, Math.PI * 0.9, Math.PI * 1.9)
    ctx.arc(shape.x + shape.size * 0.5, shape.y + shape.size * 0.42, shape.size * 0.25, Math.PI * 1.0, Math.PI * 2.0)
    ctx.arc(shape.x + shape.size * 0.68, shape.y + shape.size * 0.58, shape.size * 0.22, Math.PI * 1.1, Math.PI * 0.1)
    ctx.closePath()
    ctx.fill()
  }

  ctx.restore()
}

export default function NewStickerPage() {
  const { data: session, status } = useSession()

  const [message, setMessage] = useState<MessageState>(null)
  const [name, setName] = useState('')
  const [existingCategories, setExistingCategories] = useState<string[]>(PRESET_CATEGORIES)
  const [categoryMode, setCategoryMode] = useState<'existing' | 'new'>('existing')
  const [selectedCategory, setSelectedCategory] = useState('custom')
  const [newCategory, setNewCategory] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [stickerPreviewUrl, setStickerPreviewUrl] = useState<string | null>(null)
  const [isDraggingSticker, setIsDraggingSticker] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [sourceUrl, setSourceUrl] = useState('')
  const [importingUrl, setImportingUrl] = useState(false)
  const [isSaveConfirmOpen, setIsSaveConfirmOpen] = useState(false)
  const [sourceTab, setSourceTab] = useState<'upload' | 'url' | 'icon' | 'emoji'>('upload')
  const [iconQuery, setIconQuery] = useState('sparkle')
  const [emojiQuery, setEmojiQuery] = useState('party')
  const [iconItems, setIconItems] = useState<StickerSearchItem[]>([])
  const [emojiItems, setEmojiItems] = useState<StickerSearchItem[]>([])
  const [searchingIcons, setSearchingIcons] = useState(false)
  const [searchingEmoji, setSearchingEmoji] = useState(false)
  const [importingRemoteId, setImportingRemoteId] = useState<string | null>(null)
  const [removeBgLoading, setRemoveBgLoading] = useState(false)
  const [bgRemoved, setBgRemoved] = useState(false)
  const [originalFileBeforeBgRemove, setOriginalFileBeforeBgRemove] = useState<File | null>(null)

  const [drawColor, setDrawColor] = useState('#111111')
  const [brushSize, setBrushSize] = useState(8)
  const [shapeSize, setShapeSize] = useState(140)
  const [shapeSearch, setShapeSearch] = useState('')
  const [isDrawing, setIsDrawing] = useState(false)
  const [shapes, setShapes] = useState<CanvasShape[]>([])
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null)

  const stickerInputRef = useRef<HTMLInputElement | null>(null)
  const uploadFormRef = useRef<HTMLFormElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const canvasWrapRef = useRef<HTMLDivElement | null>(null)
  const shapeDragStateRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null)

  const loadFileIntoCanvas = useCallback(async (targetFile: File) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const objectUrl = URL.createObjectURL(targetFile)
    try {
      const image = await loadImage(objectUrl)
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const scale = Math.min(canvas.width / image.width, canvas.height / image.height)
      const drawWidth = image.width * scale
      const drawHeight = image.height * scale
      const drawX = (canvas.width - drawWidth) / 2
      const drawY = (canvas.height - drawHeight) / 2

      ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight)
      setShapes([])
      setSelectedShapeId(null)
      setMessage({ type: 'success', text: `Sticker ${targetFile.name} loaded into editor. You can draw and add shapes.` })
    } finally {
      URL.revokeObjectURL(objectUrl)
    }
  }, [])

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
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/list-sticker', { cache: 'no-store' })
        const data = await res.json()
        const items = Array.isArray(data?.stickerItems) ? data.stickerItems : []
        const found = new Set(PRESET_CATEGORIES)

        for (const item of items) {
          const category = extractCategoryFromObjectName(item?.objectName)
          if (category) found.add(category)
        }

        const sorted = Array.from(found).sort()
        setExistingCategories(sorted)
        setSelectedCategory(prev => (sorted.includes(prev) ? prev : sorted[0] || 'custom'))
      } catch {
        setExistingCategories(PRESET_CATEGORIES)
      }
    }

    void fetchCategories()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }, [])

  const setStickerFile = (nextFile: File | null, source: 'drop' | 'picker' | 'canvas' | 'paste' = 'picker') => {
    if (!nextFile) {
      setFile(null)
      return
    }

    if (!nextFile.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'File must be an image.' })
      return
    }

    if (nextFile.size > MAX_FILE_SIZE) {
      setMessage({ type: 'error', text: 'Maximum file size is 5MB.' })
      return
    }

    setFile(nextFile)
    setBgRemoved(false)
    setOriginalFileBeforeBgRemove(null)
    if (source !== 'canvas') {
      void loadFileIntoCanvas(nextFile)
    }
    if (source !== 'canvas') {
      setMessage({ type: 'success', text: `File ${nextFile.name} is ready to upload.` })
    }
  }

  const importStickerFromRemote = async (rawUrl: string, preferredName: string) => {
    const normalizedUrl = normalizeExternalImageUrl(rawUrl)
    if (!normalizedUrl) {
      throw new Error('Invalid image URL. Use an http/https URL.')
    }

    const response = await fetch(normalizedUrl, { cache: 'no-store' })
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}))
      throw new Error(payload?.error || 'Failed to fetch image from URL.')
    }

    const blob = await response.blob()
    if (!blob.type.startsWith('image/')) {
      throw new Error('URL is not an image resource.')
    }

    const extension = blob.type.includes('svg') ? 'svg' : blob.type.split('/')[1] || 'png'
    const safePreferredName =
      preferredName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-_]+/g, '-')
        .replace(/^-+|-+$/g, '') || `imported-sticker-${Date.now()}`

    const importedFile = new File([blob], `${safePreferredName}.${extension}`, { type: blob.type || 'image/png' })
    setStickerFile(importedFile, 'picker')
  }

  const searchStickerProvider = useCallback(async (provider: StickerSearchProvider, query: string) => {
    const params = new URLSearchParams({ provider, q: query, limit: '24' })
    const response = await fetch(`/api/sticker-search?${params.toString()}`, { cache: 'no-store' })
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}))
      throw new Error(payload?.error || `Failed searching ${provider}`)
    }

    const payload = await response.json()
    const items = Array.isArray(payload?.items) ? payload.items : []
    return items as StickerSearchItem[]
  }, [])

  const importImageFromUrl = async () => {
    setImportingUrl(true)
    setMessage(null)

    try {
      const filenameFromUrl = (() => {
        try {
          const decoded = decodeURIComponent(sourceUrl)
          const raw = decoded.split('/').pop() || ''
          const sanitized = raw.replace(/[^a-zA-Z0-9._-]+/g, '-')
          const base = sanitized.replace(/\.[a-zA-Z0-9]+$/, '')
          if (base) return base
        } catch {
          // Ignore filename parsing errors
        }
        return `google-sticker-${Date.now()}`
      })()

      await importStickerFromRemote(sourceUrl, filenameFromUrl)
      setMessage({ type: 'success', text: 'Image was imported successfully from URL.' })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while importing URL image.'
      setMessage({ type: 'error', text: errorMessage })
    } finally {
      setImportingUrl(false)
    }
  }

  const handleSearchIcons = useCallback(async () => {
    setSearchingIcons(true)
    try {
      const items = await searchStickerProvider('iconify', iconQuery.trim() || 'sparkle')
      setIconItems(items)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search icons.'
      setMessage({ type: 'error', text: errorMessage })
    } finally {
      setSearchingIcons(false)
    }
  }, [iconQuery, searchStickerProvider])

  const handleSearchEmoji = useCallback(async () => {
    setSearchingEmoji(true)
    try {
      const items = await searchStickerProvider('openmoji', emojiQuery.trim() || 'party')
      setEmojiItems(items)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search emoji stickers.'
      setMessage({ type: 'error', text: errorMessage })
    } finally {
      setSearchingEmoji(false)
    }
  }, [emojiQuery, searchStickerProvider])

  useEffect(() => {
    if (sourceTab === 'icon' && iconItems.length === 0 && !searchingIcons) {
      void handleSearchIcons()
    }
  }, [sourceTab, iconItems.length, searchingIcons, handleSearchIcons])

  useEffect(() => {
    if (sourceTab === 'emoji' && emojiItems.length === 0 && !searchingEmoji) {
      void handleSearchEmoji()
    }
  }, [sourceTab, emojiItems.length, searchingEmoji, handleSearchEmoji])

  const handleImportProviderItem = async (item: StickerSearchItem) => {
    setImportingRemoteId(item.id)
    setMessage(null)

    try {
      await importStickerFromRemote(item.sourceUrl, item.name)
      setMessage({ type: 'success', text: `${item.name} imported from ${item.provider}.` })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed importing ${item.name}.`
      setMessage({ type: 'error', text: errorMessage })
    } finally {
      setImportingRemoteId(null)
    }
  }

  const removeImageBackground = async (src: string) => {
    const image = await loadImage(src)
    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth || image.width
    canvas.height = image.naturalHeight || image.height
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      const nearNeutral = max - min < 42
      const bright = max > 210

      if (bright && nearNeutral) {
        data[i + 3] = 0
      }
    }

    ctx.putImageData(imageData, 0, 0)
    return await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'))
  }

  const toggleRemoveBackground = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Please choose a sticker file first.' })
      return
    }

    if (bgRemoved) {
      if (!originalFileBeforeBgRemove) {
        setMessage({ type: 'error', text: 'Original file is not available for restore.' })
        return
      }
      setFile(originalFileBeforeBgRemove)
      setBgRemoved(false)
      setOriginalFileBeforeBgRemove(null)
      setMessage({ type: 'success', text: 'Original background has been restored.' })
      return
    }

    if (!stickerPreviewUrl) {
      setMessage({ type: 'error', text: 'Sticker preview is not available yet.' })
      return
    }

    setRemoveBgLoading(true)
    setMessage(null)

    try {
      const output = await removeImageBackground(stickerPreviewUrl)
      if (!output) {
        setMessage({ type: 'error', text: 'Failed to process background removal.' })
        return
      }

      const baseName = file.name.replace(/\.[^.]+$/, '')
      const processedFile = new File([output], `${baseName}-nobg.png`, { type: 'image/png' })
      setOriginalFileBeforeBgRemove(file)
      setFile(processedFile)
      setBgRemoved(true)
      setMessage({ type: 'success', text: 'Background removal has been applied.' })
    } catch {
      setMessage({ type: 'error', text: 'An error occurred while removing background.' })
    } finally {
      setRemoveBgLoading(false)
    }
  }

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

  const clearCanvas = (notify = true) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setShapes([])
    setSelectedShapeId(null)
    if (notify) {
      setMessage({ type: 'success', text: 'Canvas has been cleared.' })
    }
  }

  const removeSelectedShape = useCallback(() => {
    if (!selectedShapeId) return
    setShapes(prev => prev.filter(shape => shape.id !== selectedShapeId))
    setSelectedShapeId(null)
  }, [selectedShapeId])

  const undoLastShape = () => {
    setShapes(prev => prev.slice(0, -1))
    setSelectedShapeId(null)
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
    if (!SHAPE_LIBRARY.some(item => item.kind === raw)) return

    const wrap = canvasWrapRef.current
    if (!wrap) return
    const bounds = wrap.getBoundingClientRect()
    const scaleX = CANVAS_SIZE / bounds.width
    const scaleY = CANVAS_SIZE / bounds.height
    const size = Math.max(20, shapeSize)
    const x = (event.clientX - bounds.left) * scaleX - size / 2
    const y = (event.clientY - bounds.top) * scaleY - size / 2
    addShape(raw as ShapeKind, { x, y })
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

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedShapeId) {
        event.preventDefault()
        removeSelectedShape()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedShapeId, removeSelectedShape])

  const useCanvasAsStickerFile = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const exportCanvas = document.createElement('canvas')
    exportCanvas.width = canvas.width
    exportCanvas.height = canvas.height
    const exportCtx = exportCanvas.getContext('2d')
    if (!exportCtx) {
      setMessage({ type: 'error', text: 'Failed to prepare canvas export.' })
      return
    }

    exportCtx.clearRect(0, 0, exportCanvas.width, exportCanvas.height)
    exportCtx.drawImage(canvas, 0, 0)
    for (const shape of shapes) {
      drawShapeOnContext(exportCtx, shape)
    }

    const blob = await new Promise<Blob | null>(resolve => exportCanvas.toBlob(resolve, 'image/png'))
    if (!blob) {
      setMessage({ type: 'error', text: 'Failed to create sticker from canvas.' })
      return
    }

    const hasInk = blob.size > 1200
    if (!hasInk) {
      setMessage({ type: 'error', text: 'Canvas is empty. Draw something first before using it as sticker.' })
      return
    }

    const nextName = name.trim() || `drawn-sticker-${Date.now()}`
    const canvasFile = new File([blob], `${nextName}.png`, { type: 'image/png' })
    setStickerFile(canvasFile, 'canvas')
    setMessage({ type: 'success', text: 'Sticker preview was taken from canvas.' })
  }

  const exportEditorToFile = async (fileBaseName: string) => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const exportCanvas = document.createElement('canvas')
    exportCanvas.width = canvas.width
    exportCanvas.height = canvas.height
    const exportCtx = exportCanvas.getContext('2d')
    if (!exportCtx) return null

    exportCtx.clearRect(0, 0, exportCanvas.width, exportCanvas.height)
    exportCtx.drawImage(canvas, 0, 0)
    for (const shape of shapes) {
      drawShapeOnContext(exportCtx, shape)
    }

    const blob = await new Promise<Blob | null>(resolve => exportCanvas.toBlob(resolve, 'image/png'))
    if (!blob) return null

    const safeBase = toSafeValue(fileBaseName) || `edited-sticker-${Date.now()}`
    return new File([blob], `${safeBase}.png`, { type: 'image/png' })
  }

  const handlePasteFromClipboard = async () => {
    if (!navigator.clipboard?.read) {
      setMessage({ type: 'error', text: 'This browser does not support image paste from clipboard.' })
      return
    }

    try {
      const clipboardItems = await navigator.clipboard.read()
      for (const clipboardItem of clipboardItems) {
        const imageType = clipboardItem.types.find(type => type.startsWith('image/'))
        if (!imageType) continue

        const blob = await clipboardItem.getType(imageType)
        const pastedFile = new File([blob], `pasted-sticker-${Date.now()}.png`, { type: blob.type || 'image/png' })
        setStickerFile(pastedFile, 'paste')
        return
      }

      setMessage({ type: 'error', text: 'Clipboard does not contain an image.' })
    } catch {
      setMessage({ type: 'error', text: 'Cannot read image from clipboard.' })
    }
  }

  const handleUpload = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)

    if (!file) {
      setMessage({ type: 'error', text: 'Sticker file is required.' })
      return
    }

    setIsSaveConfirmOpen(true)
  }

  const performUpload = async () => {
    const formElement = uploadFormRef.current
    if (!formElement) {
      setMessage({ type: 'error', text: 'Upload form is not ready.' })
      return
    }

    if (!file) {
      setMessage({ type: 'error', text: 'Sticker file is required.' })
      return
    }

    setUploading(true)
    setIsSaveConfirmOpen(false)

    try {
      const resolvedCategory = categoryMode === 'existing' ? selectedCategory : newCategory
      const safeName = toSafeValue(name) || `sticker_${Date.now()}`
      const safeCategory = toSafeValue(resolvedCategory) || 'custom'
      const editorFile = await exportEditorToFile(safeName)

      if (!editorFile) {
        setMessage({ type: 'error', text: 'Failed to export editor output.' })
        return
      }

      const formData = new FormData()
      formData.append('file', editorFile)
      formData.append('name', safeName)
      formData.append('category', safeCategory)

      const res = await fetch('/api/upload-sticker', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json().catch(() => ({ error: 'Invalid server response.' }))

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Sticker upload failed.' })
        return
      }

      setMessage({ type: 'success', text: 'Sticker was created successfully.' })
      setName('')
      setCategoryMode('existing')
      setSelectedCategory('custom')
      setNewCategory('')
      setFile(null)
      clearCanvas(false)
      formElement.reset()
      window.dispatchEvent(new Event('stickerLibraryUpdated'))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setMessage({ type: 'error', text: `An error occurred while uploading sticker: ${errorMessage}` })
    } finally {
      setUploading(false)
    }
  }

  const handleDropSticker = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()

    const droppedFile = event.dataTransfer.files?.[0]
    if (!droppedFile) return

    setStickerFile(droppedFile, 'drop')
    setIsDraggingSticker(false)
  }

  const selectedShape = shapes.find(shape => shape.id === selectedShapeId) || null
  const filteredShapeLibrary = SHAPE_LIBRARY.filter(item => {
    const keyword = shapeSearch.trim().toLowerCase()
    if (!keyword) return true
    if (item.label.toLowerCase().includes(keyword)) return true
    return item.keywords.some(entry => entry.toLowerCase().includes(keyword))
  })

  const renderShapePreview = (shape: CanvasShape) => {
    const color = shape.color
    if (shape.kind === 'square') return <div className="w-full h-full" style={{ backgroundColor: color }} />
    if (shape.kind === 'circle') return <div className="w-full h-full rounded-full" style={{ backgroundColor: color }} />
    if (shape.kind === 'triangle') return <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true"><polygon points="50,0 100,100 0,100" fill={color} /></svg>
    if (shape.kind === 'diamond') return <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true"><polygon points="50,0 100,50 50,100 0,50" fill={color} /></svg>
    if (shape.kind === 'star') return <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true"><polygon points="50,4 61,36 96,36 67,56 78,90 50,70 22,90 33,56 4,36 39,36" fill={color} /></svg>
    if (shape.kind === 'pentagon') return <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true"><polygon points="50,4 95,38 78,92 22,92 5,38" fill={color} /></svg>
    if (shape.kind === 'hexagon') return <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true"><polygon points="25,6 75,6 98,50 75,94 25,94 2,50" fill={color} /></svg>
    if (shape.kind === 'heart') return <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true"><path d="M50 90 C90 62, 96 34, 76 22 C62 14, 53 22, 50 30 C47 22, 38 14, 24 22 C4 34, 10 62, 50 90 Z" fill={color} /></svg>
    if (shape.kind === 'plus') return <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true"><path d="M38 8 H62 V38 H92 V62 H62 V92 H38 V62 H8 V38 H38 Z" fill={color} /></svg>
    return <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true"><path d="M20 70 A20 20 0 1 1 35 36 A20 20 0 1 1 65 36 A18 18 0 1 1 80 70 Z" fill={color} /></svg>
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
            <h1 className="text-3xl sm:text-4xl font-bold text-[#4f3040]">Create New Sticker</h1>
            <p className="text-sm sm:text-base text-[#705362] mt-1">
              Upload a sticker file, or draw directly on canvas and save it to library.
            </p>
          </div>
          <Link
            href="/admin/sticker/list"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-[#e0b1ca] bg-white text-[#5b3b4b] hover:bg-[#fff4f9]"
          >
            <List className="w-4 h-4 mr-2" /> Open Sticker List
          </Link>
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
            <h2 className="text-xl font-semibold text-[#4f3040] mb-4">Sticker Preview</h2>
            <div className="rounded-xl border border-[#ecd4e1] bg-[#fff7fb] p-3">
              <div
                ref={canvasWrapRef}
                onDragOver={handleCanvasDragOver}
                onDrop={handleCanvasDrop}
                className="relative w-full max-w-[520px] mx-auto aspect-square rounded-lg bg-white border border-[#f0e2e8] overflow-hidden"
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
                        {renderShapePreview(shape)}
                      </div>
                    )
                  })}
                </div>
              </div>

              <p className="text-xs text-[#705362] mt-2">Preview only: all controls are on the right panel.</p>
              <div className="mt-3 text-xs text-[#705362] flex flex-wrap gap-x-4 gap-y-1">
                <span>Total shapes: {shapes.length}</span>
                <span>Brush size: {brushSize}px</span>
                <span>Selected shape: {selectedShape ? SHAPE_LIBRARY.find(item => item.kind === selectedShape.kind)?.label || selectedShape.kind : '-'}</span>
              </div>
            </div>

          </div>

          <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 h-fit border border-[#f3d7e5]">
            <h2 className="text-xl font-semibold text-[#4f3040] mb-4">Sticker Settings</h2>
            <form ref={uploadFormRef} onSubmit={handleUpload} className="space-y-4">
              <div className="rounded-xl border border-[#ecd4e1] bg-[#fff9fd] p-3 space-y-3">
                <p className="text-sm font-semibold text-[#5d4150]">Editor Controls</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="text-sm text-[#5d4150] font-medium">
                    Drawing Color
                    <input
                      type="color"
                      value={drawColor}
                      onChange={event => setDrawColor(event.target.value)}
                      className="mt-1 w-full h-10 rounded border border-[#d9c8d1]"
                    />
                  </label>
                  <label className="text-sm text-[#5d4150] font-medium">
                    Brush Size
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
                    Shape Size
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

                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#8b6778]" />
                  <input
                    type="text"
                    value={shapeSearch}
                    onChange={event => setShapeSearch(event.target.value)}
                    placeholder="Search shapes..."
                    className="w-full rounded-lg border border-[#d9c8d1] bg-white px-3 py-2 text-sm text-[#4a2337] placeholder:text-[#a48394] focus:outline-none focus:ring-2 focus:ring-[#f2aacb]"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {filteredShapeLibrary.map(item => (
                    <button
                      key={item.kind}
                      type="button"
                      draggable
                      onDragStart={handleShapeDragStart(item.kind)}
                      onClick={() => addShape(item.kind)}
                      className="inline-flex items-center justify-center gap-1 rounded-xl border border-[#e7a0c2] bg-[#fff3f9] px-3 py-2 text-xs text-[#6d3f55] hover:bg-[#ffe7f2] active:scale-[0.98] transition"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                {filteredShapeLibrary.length === 0 && <p className="text-xs text-[#8d6f7d]">No shapes matched your search.</p>}

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => clearCanvas()}
                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-[#e7a0c2] bg-[#fff3f9] px-3 py-2 text-sm text-[#6d3f55] hover:bg-[#ffe7f2]"
                  >
                    <Eraser className="w-4 h-4" /> Clear
                  </button>
                  <button
                    type="button"
                    onClick={useCanvasAsStickerFile}
                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-[#e7a0c2] bg-[#f8bfd7] px-3 py-2 text-sm text-[#4a2337] hover:bg-[#f2aacb]"
                  >
                    <PencilLine className="w-4 h-4" /> Use Canvas
                  </button>
                  <button
                    type="button"
                    onClick={undoLastShape}
                    disabled={shapes.length === 0}
                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-[#e7a0c2] bg-[#fff3f9] px-3 py-2 text-sm text-[#6d3f55] hover:bg-[#ffe7f2] disabled:opacity-50"
                  >
                    <Undo2 className="w-4 h-4" /> Undo
                  </button>
                </div>

                {selectedShape && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 rounded-lg border border-[#ecd4e1] bg-white p-3">
                    <label className="text-xs text-[#5d4150] font-medium">
                      Selected Shape Color
                      <input
                        type="color"
                        value={selectedShape.color}
                        onChange={event => {
                          const nextColor = event.target.value
                          setShapes(prev => prev.map(shape => (shape.id === selectedShape.id ? { ...shape, color: nextColor } : shape)))
                        }}
                        className="mt-1 w-full h-9 rounded border border-[#d9c8d1]"
                      />
                    </label>
                    <label className="text-xs text-[#5d4150] font-medium">
                      Selected Shape Size ({Math.round(selectedShape.size)}px)
                      <input
                        type="range"
                        min={24}
                        max={320}
                        value={selectedShape.size}
                        onChange={event => {
                          const nextSize = clamp(Number(event.target.value), 24, 320)
                          setShapes(prev =>
                            prev.map(shape => {
                              if (shape.id !== selectedShape.id) return shape
                              return {
                                ...shape,
                                size: nextSize,
                                x: clamp(shape.x, 0, CANVAS_SIZE - nextSize),
                                y: clamp(shape.y, 0, CANVAS_SIZE - nextSize),
                              }
                            })
                          )
                        }}
                        className="mt-2 w-full"
                      />
                    </label>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={removeSelectedShape}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100"
                      >
                        <Trash2 className="w-4 h-4" /> Delete Shape
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="sticker-name" className="block text-sm font-medium text-[#5d4150] mb-1">
                  Sticker Name
                </label>
                <input
                  id="sticker-name"
                  type="text"
                  value={name}
                  onChange={event => setName(event.target.value)}
                  placeholder="example: heart-sparkle"
                  className="w-full rounded-lg border border-[#d9c8d1] bg-white px-3 py-2 text-sm text-[#4a2337] placeholder:text-[#a48394] focus:outline-none focus:ring-2 focus:ring-[#f2aacb]"
                />
                <p className="text-[11px] text-[#8d6f7d] mt-1">Auto slug: {toSafeValue(name) || '-'}</p>
              </div>

              <div>
                <label htmlFor="sticker-category" className="block text-sm font-medium text-[#5d4150] mb-1">
                  Category
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select
                    value={categoryMode}
                    onChange={event => setCategoryMode(event.target.value as 'existing' | 'new')}
                    className="w-full rounded-lg border border-[#d9c8d1] bg-white px-3 py-2 text-sm text-[#4a2337] focus:outline-none focus:ring-2 focus:ring-[#f2aacb]"
                  >
                    <option value="existing">Choose Existing</option>
                    <option value="new">Create New</option>
                  </select>

                  {categoryMode === 'existing' ? (
                    <select
                      value={selectedCategory}
                      onChange={event => setSelectedCategory(event.target.value)}
                      className="w-full rounded-lg border border-[#d9c8d1] bg-white px-3 py-2 text-sm text-[#4a2337] focus:outline-none focus:ring-2 focus:ring-[#f2aacb]"
                    >
                      {existingCategories.map(item => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id="sticker-category"
                      type="text"
                      value={newCategory}
                      onChange={event => setNewCategory(event.target.value)}
                      placeholder="example: graduation"
                      className="w-full rounded-lg border border-[#d9c8d1] bg-white px-3 py-2 text-sm text-[#4a2337] placeholder:text-[#a48394] focus:outline-none focus:ring-2 focus:ring-[#f2aacb]"
                    />
                  )}
                </div>
                <p className="text-[11px] text-[#8d6f7d] mt-1">Final category slug: {toSafeValue(categoryMode === 'existing' ? selectedCategory : newCategory) || '-'}</p>
              </div>

              <div>
                <label htmlFor="sticker-file" className="block text-sm font-medium text-[#5d4150] mb-1">
                  Sticker Source
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  {[
                    { key: 'upload', label: 'Upload File' },
                    { key: 'url', label: 'Import URL' },
                    { key: 'icon', label: 'Search Icon' },
                    { key: 'emoji', label: 'Emoji Sticker' },
                  ].map(tab => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setSourceTab(tab.key as 'upload' | 'url' | 'icon' | 'emoji')}
                      className={`rounded-lg border px-3 py-2 text-xs sm:text-sm transition ${
                        sourceTab === tab.key
                          ? 'border-[#d979ab] bg-[#ffddec] text-[#5b3147]'
                          : 'border-[#e7c7d7] bg-white text-[#6d3f55] hover:bg-[#fff5fa]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {sourceTab === 'upload' && (
                  <div>
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
                      <p className="text-[#5d4150] font-medium">Drag and drop sticker file here</p>
                      <p className="text-xs text-[#8c6b7a] mt-1">or click to choose file</p>
                      <p className="text-xs text-[#6d3f55] mt-2 truncate">{file ? file.name : 'No file selected yet'}</p>
                    </div>

                    <button
                      type="button"
                      onClick={handlePasteFromClipboard}
                      className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-lg border border-[#e7a0c2] bg-[#fff3f9] px-3 py-2 text-sm text-[#6d3f55] hover:bg-[#ffe7f2]"
                    >
                      <Clipboard className="w-4 h-4" /> Paste Image from Clipboard
                    </button>
                    <p className="text-[11px] text-[#8d6f7d] mt-1">Supported format: any image type, up to 5MB.</p>
                  </div>
                )}

                {sourceTab === 'url' && (
                  <div className="rounded-xl border border-[#ecd4e1] bg-[#fff9fd] p-3 space-y-2">
                    <label htmlFor="sticker-url" className="block text-sm font-medium text-[#5d4150]">
                      Import Image from URL (Google)
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        id="sticker-url"
                        type="url"
                        value={sourceUrl}
                        onChange={event => setSourceUrl(event.target.value)}
                        placeholder="https://..."
                        className="flex-1 rounded-lg border border-[#d9c8d1] bg-white px-3 py-2 text-sm text-[#4a2337] placeholder:text-[#a48394] focus:outline-none focus:ring-2 focus:ring-[#f2aacb]"
                      />
                      <button
                        type="button"
                        onClick={importImageFromUrl}
                        disabled={importingUrl}
                        className="inline-flex items-center justify-center rounded-lg border border-[#e7a0c2] bg-[#fff3f9] px-3 py-2 text-sm text-[#6d3f55] hover:bg-[#ffe7f2] disabled:opacity-60"
                      >
                        <Link2 className="w-4 h-4 mr-1" />
                        {importingUrl ? 'Fetching...' : 'Fetch URL'}
                      </button>
                    </div>
                    <p className="text-[11px] text-[#8d6f7d]">Tip: copy image address from Google Images and paste it here.</p>
                  </div>
                )}

                {sourceTab === 'icon' && (
                  <div className="rounded-xl border border-[#ecd4e1] bg-[#fff9fd] p-3 space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={iconQuery}
                        onChange={event => setIconQuery(event.target.value)}
                        placeholder="Search Iconify icons"
                        className="flex-1 rounded-lg border border-[#d9c8d1] bg-white px-3 py-2 text-sm text-[#4a2337] placeholder:text-[#a48394] focus:outline-none focus:ring-2 focus:ring-[#f2aacb]"
                      />
                      <button
                        type="button"
                        onClick={handleSearchIcons}
                        disabled={searchingIcons}
                        className="inline-flex items-center justify-center rounded-lg border border-[#e7a0c2] bg-[#fff3f9] px-3 py-2 text-sm text-[#6d3f55] hover:bg-[#ffe7f2] disabled:opacity-60"
                      >
                        <Search className="w-4 h-4 mr-1" />
                        {searchingIcons ? 'Searching...' : 'Search'}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1">
                      {iconItems.map(item => (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => handleImportProviderItem(item)}
                          disabled={importingRemoteId === item.id}
                          className="rounded-lg border border-[#e7c7d7] bg-white p-2 text-left hover:bg-[#fff5fa] disabled:opacity-60"
                        >
                          <div className="h-16 rounded-md border border-[#f0e2e8] bg-[#fffafb] flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.previewUrl} alt={item.name} className="w-11 h-11 object-contain" />
                          </div>
                          <p className="mt-2 text-xs text-[#5d4150] line-clamp-2">{item.name}</p>
                        </button>
                      ))}
                      {!searchingIcons && iconItems.length === 0 && (
                        <p className="col-span-full text-xs text-[#8d6f7d]">No icons found. Try another keyword.</p>
                      )}
                    </div>
                  </div>
                )}

                {sourceTab === 'emoji' && (
                  <div className="rounded-xl border border-[#ecd4e1] bg-[#fff9fd] p-3 space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={emojiQuery}
                        onChange={event => setEmojiQuery(event.target.value)}
                        placeholder="Search OpenMoji emoji"
                        className="flex-1 rounded-lg border border-[#d9c8d1] bg-white px-3 py-2 text-sm text-[#4a2337] placeholder:text-[#a48394] focus:outline-none focus:ring-2 focus:ring-[#f2aacb]"
                      />
                      <button
                        type="button"
                        onClick={handleSearchEmoji}
                        disabled={searchingEmoji}
                        className="inline-flex items-center justify-center rounded-lg border border-[#e7a0c2] bg-[#fff3f9] px-3 py-2 text-sm text-[#6d3f55] hover:bg-[#ffe7f2] disabled:opacity-60"
                      >
                        <Smile className="w-4 h-4 mr-1" />
                        {searchingEmoji ? 'Searching...' : 'Search'}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1">
                      {emojiItems.map(item => (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => handleImportProviderItem(item)}
                          disabled={importingRemoteId === item.id}
                          className="rounded-lg border border-[#e7c7d7] bg-white p-2 text-left hover:bg-[#fff5fa] disabled:opacity-60"
                        >
                          <div className="h-16 rounded-md border border-[#f0e2e8] bg-[#fffafb] flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.previewUrl} alt={item.name} className="w-11 h-11 object-contain" />
                          </div>
                          <p className="mt-2 text-xs text-[#5d4150] line-clamp-2">{item.name}</p>
                        </button>
                      ))}
                      {!searchingEmoji && emojiItems.length === 0 && (
                        <p className="col-span-full text-xs text-[#8d6f7d]">No emoji stickers found. Try another keyword.</p>
                      )}
                    </div>
                  </div>
                )}

                <input
                  ref={stickerInputRef}
                  id="sticker-file"
                  type="file"
                  accept="image/*"
                  onChange={event => setStickerFile(event.target.files?.[0] || null, 'picker')}
                  className="hidden"
                />
              </div>

              <div className="text-[11px] text-[#8d6f7d]">
                Source provider: {sourceTab === 'icon' ? 'Iconify' : sourceTab === 'emoji' ? 'OpenMoji' : 'Manual import'}
              </div>

              <div>
                <p className="text-sm font-medium text-[#5d4150] mb-1">Selected Sticker File</p>
                <p className="text-xs text-[#6d3f55] truncate rounded-lg border border-[#ecd4e1] bg-[#fffafc] px-3 py-2">
                  {file ? file.name : 'No file selected yet'}
                </p>
                {file && <p className="text-[11px] text-[#8d6f7d] mt-1">Size: {formatFileSize(file.size)}</p>}
              </div>

              <button
                type="button"
                onClick={toggleRemoveBackground}
                disabled={removeBgLoading || !file}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-[#d89bbd] bg-[#ffddec] px-3 py-2 text-sm text-[#5b3147] hover:bg-[#ffcde2] disabled:opacity-60"
              >
                <WandSparkles className="w-4 h-4" />
                {removeBgLoading ? 'Processing Remove BG...' : bgRemoved ? 'Restore Background' : 'Remove Background'}
              </button>

              <button
                type="submit"
                disabled={uploading}
                className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-[#f8bfd7] text-[#4a2337] border border-[#e7a0c2] hover:bg-[#f2aacb] transition disabled:opacity-60"
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Save Sticker'}
              </button>
            </form>
          </div>
        </div>

        <ConfirmDialog
          open={isSaveConfirmOpen}
          title="Save Sticker"
          message="Are you sure you want to save this sticker? The current canvas preview will be used as final output."
          confirmLabel="Yes, Save"
          cancelLabel="Cancel"
          loading={uploading}
          onCancel={() => setIsSaveConfirmOpen(false)}
          onConfirm={() => void performUpload()}
        />
      </div>
    </div>
  )
}
