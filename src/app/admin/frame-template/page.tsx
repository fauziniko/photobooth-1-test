'use client'

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Plus, RefreshCw, Save } from 'lucide-react'

type StickerItem = {
  name: string
  url: string
  objectName?: string
}

type CanvasSticker = {
  id: string
  src: string
  originalSrc: string
  label: string
  x: number
  y: number
  size: number
  rotate: number
  removeBg: boolean
  z: number
}

type SlotCount = 3 | 4 | 6 | 8
type CanvasFormat = '1:3' | '2:3' | 'A4' | 'A3'

type SlotRect = {
  x: number
  y: number
  width: number
  height: number
}

type TemplateSettings = {
  canvasWidth: number
  canvasHeight: number
  padding: number
  gap: number
  bottomSpace: number
  frameBorderRadius: number
  photoBorderRadius: number
  photoWidth: number
  photoHeight: number
  slotCount: SlotCount
  photoSlots: SlotRect[]
}

const CANVAS_PADDING = 20
const CANVAS_GAP = 10
const PHOTO_RATIO = 4 / 3

const SLOT_COUNT_OPTIONS: SlotCount[] = [3, 4, 6, 8]

const FORMAT_PRESETS: Record<CanvasFormat, { ratio: number; areaScale: number; label: string }> = {
  '1:3': { ratio: 1 / 3, areaScale: 1, label: '1:3 (Portrait Strip)' },
  '2:3': { ratio: 2 / 3, areaScale: 1, label: '2:3 (Portrait)' },
  A4: { ratio: 210 / 297, areaScale: 1.1, label: 'A4 (210x297)' },
  A3: { ratio: 297 / 420, areaScale: 1.5, label: 'A3 (297x420)' },
}

const BASE_SLOT_AREA = 100000

const getCanvasSize = (slotCount: SlotCount, format: CanvasFormat) => {
  const preset = FORMAT_PRESETS[format]
  const area = slotCount * BASE_SLOT_AREA * preset.areaScale
  const width = Math.round(Math.sqrt(area * preset.ratio))
  const height = Math.round(width / preset.ratio)
  return { width, height }
}

const computeSlotLayout = (slotCount: SlotCount, canvasWidth: number, canvasHeight: number) => {
  const availableWidth = Math.max(canvasWidth - CANVAS_PADDING * 2, 80)
  const availableHeight = Math.max(canvasHeight - CANVAS_PADDING * 2, 80)

  let best: {
    columns: number
    rows: number
    photoWidth: number
    photoHeight: number
  } | null = null

  for (let columns = 1; columns <= slotCount; columns += 1) {
    const rows = Math.ceil(slotCount / columns)
    const widthByColumns = (availableWidth - CANVAS_GAP * (columns - 1)) / columns
    const heightByRows = (availableHeight - CANVAS_GAP * (rows - 1)) / rows

    if (widthByColumns <= 0 || heightByRows <= 0) continue

    const photoWidth = Math.min(widthByColumns, heightByRows * PHOTO_RATIO)
    const photoHeight = photoWidth / PHOTO_RATIO

    if (photoWidth <= 0 || photoHeight <= 0) continue

    if (!best || photoWidth * photoHeight > best.photoWidth * best.photoHeight) {
      best = { columns, rows, photoWidth, photoHeight }
    }
  }

  if (!best) {
    return {
      columns: 1,
      rows: slotCount,
      photoWidth: 120,
      photoHeight: 90,
      slots: [] as SlotRect[],
    }
  }

  const { columns, rows, photoWidth, photoHeight } = best
  const slots: SlotRect[] = []

  const totalGridHeight = rows * photoHeight + (rows - 1) * CANVAS_GAP
  const startY = (canvasHeight - totalGridHeight) / 2

  for (let row = 0; row < rows; row += 1) {
    const firstIndex = row * columns
    const remaining = slotCount - firstIndex
    const itemsInRow = Math.min(columns, remaining)
    const rowWidth = itemsInRow * photoWidth + (itemsInRow - 1) * CANVAS_GAP
    const startX = (canvasWidth - rowWidth) / 2

    for (let col = 0; col < itemsInRow; col += 1) {
      const x = startX + col * (photoWidth + CANVAS_GAP)
      const y = startY + row * (photoHeight + CANVAS_GAP)
      slots.push({ x, y, width: photoWidth, height: photoHeight })
    }
  }

  return {
    columns,
    rows,
    photoWidth,
    photoHeight,
    slots,
  }
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const normalizeExternalImageUrl = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''

  if (value.startsWith('data:') || value.startsWith('blob:') || value.startsWith('/api/')) {
    return value
  }

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

const extractImageUrlFromHtml = (html: string) => {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i)
  return match?.[1] ?? ''
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

const drawCoverImage = (ctx: CanvasRenderingContext2D, image: HTMLImageElement, width: number, height: number) => {
  const imageRatio = image.width / image.height
  const canvasRatio = width / height

  let drawWidth = width
  let drawHeight = height
  let offsetX = 0
  let offsetY = 0

  if (imageRatio > canvasRatio) {
    drawWidth = height * imageRatio
    offsetX = (width - drawWidth) / 2
  } else {
    drawHeight = width / imageRatio
    offsetY = (height - drawHeight) / 2
  }

  ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight)
}

const inferCanvasFormat = (width: number, height: number): CanvasFormat => {
  const ratio = width / Math.max(height, 1)
  let best: CanvasFormat = '1:3'
  let bestDiff = Number.POSITIVE_INFINITY

  for (const key of Object.keys(FORMAT_PRESETS) as CanvasFormat[]) {
    const diff = Math.abs(FORMAT_PRESETS[key].ratio - ratio)
    if (diff < bestDiff) {
      best = key
      bestDiff = diff
    }
  }

  return best
}

function FrameTemplatePageContent() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const editTemplateQuery = searchParams.get('edit')?.trim() || ''

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [loadingTemplate, setLoadingTemplate] = useState(false)
  const [editingTemplateName, setEditingTemplateName] = useState<string | null>(null)
  const [templateName, setTemplateName] = useState('')
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [slotCount, setSlotCount] = useState<SlotCount>(4)
  const [canvasFormat, setCanvasFormat] = useState<CanvasFormat>('1:3')
  const [canvasSizeOverride, setCanvasSizeOverride] = useState<{ width: number; height: number } | null>(null)
  const [hasCustomSlots, setHasCustomSlots] = useState(false)
  const [backgroundImageFile, setBackgroundImageFile] = useState<File | null>(null)
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(null)
  const [backgroundImageInputUrl, setBackgroundImageInputUrl] = useState('')
  const [stickers, setStickers] = useState<StickerItem[]>([])
  const [loadingStickers, setLoadingStickers] = useState(true)
  const [refreshingStickers, setRefreshingStickers] = useState(false)
  const [canvasStickers, setCanvasStickers] = useState<CanvasSticker[]>([])
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null)
  const [photoSlots, setPhotoSlots] = useState<SlotRect[]>([])
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null)
  const [uploading, setUploading] = useState(false)

  const canvasRef = useRef<HTMLDivElement | null>(null)
  const dragStateRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null)
  const slotDragStateRef = useRef<{ index: number; offsetX: number; offsetY: number } | null>(null)
  const resizeStateRef = useRef<{ id: string; startX: number; startY: number; startSize: number } | null>(null)
  const rotateStateRef = useRef<{ id: string; centerX: number; centerY: number; startAngle: number; startRotate: number } | null>(null)

  const canvasSize = useMemo(() => {
    if (canvasSizeOverride) {
      return {
        width: Math.max(1, Math.round(canvasSizeOverride.width)),
        height: Math.max(1, Math.round(canvasSizeOverride.height)),
      }
    }
    return getCanvasSize(slotCount, canvasFormat)
  }, [canvasSizeOverride, slotCount, canvasFormat])
  const layout = useMemo(
    () => computeSlotLayout(slotCount, canvasSize.width, canvasSize.height),
    [slotCount, canvasSize.width, canvasSize.height]
  )

  useEffect(() => {
    if (hasCustomSlots) return
    setPhotoSlots(layout.slots.map(slot => ({ ...slot })))
    setSelectedSlotIndex(null)
  }, [layout.slots, hasCustomSlots])

  useEffect(() => {
    if (!backgroundImageFile) {
      setBackgroundImageUrl(null)
      return
    }

    const objectUrl = URL.createObjectURL(backgroundImageFile)
    setBackgroundImageUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [backgroundImageFile])

  const fetchStickers = async (manual = false) => {
    if (manual) {
      setRefreshingStickers(true)
    } else {
      setLoadingStickers(true)
    }

    try {
      const res = await fetch('/api/list-sticker', { cache: 'no-store' })
      const data = await res.json()
      const stickerItems = Array.isArray(data?.stickerItems) ? (data.stickerItems as StickerItem[]) : []
      setStickers(stickerItems)
    } catch {
      setMessage({ type: 'error', text: 'Failed to load sticker list.' })
    } finally {
      setLoadingStickers(false)
      setRefreshingStickers(false)
    }
  }

  useEffect(() => {
    fetchStickers()
  }, [])

  useEffect(() => {
    const loadTemplateForEdit = async () => {
      if (!editTemplateQuery) {
        setEditingTemplateName(null)
        return
      }

      setLoadingTemplate(true)
      setMessage(null)

      try {
        const res = await fetch('/api/list-frame-template', { cache: 'no-store' })
        const data = await res.json()
        const templates = Array.isArray(data?.templates) ? data.templates : []
        const target = templates.find((item: { name?: string }) => item?.name === editTemplateQuery)

        if (!target) {
          setMessage({ type: 'error', text: `Template ${editTemplateQuery} was not found.` })
          setEditingTemplateName(null)
          return
        }

        setEditingTemplateName(target.name)
        setTemplateName(target.name)

        if (target?.frameUrl) {
          setBackgroundImageFile(null)
          setBackgroundImageUrl(target.frameUrl)
          setBackgroundImageInputUrl(target.frameUrl)
        }

        const settings = target?.settings && typeof target.settings === 'object' ? target.settings : null
        if (settings) {
          const width = Number(settings.canvasWidth)
          const height = Number(settings.canvasHeight)
          const nextSlotCount = Number(settings.slotCount)
          const rawSlots = Array.isArray(settings.photoSlots) ? settings.photoSlots : []

          if (Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) {
            setCanvasSizeOverride({ width, height })
            setCanvasFormat(inferCanvasFormat(width, height))
          }

          if (nextSlotCount === 3 || nextSlotCount === 4 || nextSlotCount === 6 || nextSlotCount === 8) {
            setSlotCount(nextSlotCount)
          }

          if (rawSlots.length > 0) {
            setPhotoSlots(
              rawSlots
                .map((slot: { x?: number; y?: number; width?: number; height?: number }) => ({
                  x: Number(slot?.x) || 0,
                  y: Number(slot?.y) || 0,
                  width: Math.max(1, Number(slot?.width) || 1),
                  height: Math.max(1, Number(slot?.height) || 1),
                }))
                .slice(0, 12)
            )
            setHasCustomSlots(true)
          }
        }

        setMessage({ type: 'success', text: `Loaded template ${target.name} for editing.` })
      } catch {
        setMessage({ type: 'error', text: 'Failed to load template for editing.' })
      } finally {
        setLoadingTemplate(false)
      }
    }

    void loadTemplateForEdit()
  }, [editTemplateQuery])

  const setBackgroundFromFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Background file must be an image.' })
      return
    }

    setBackgroundImageInputUrl('')
    setBackgroundImageFile(file)
    setMessage({ type: 'success', text: 'Background updated from file.' })
  }

  const setBackgroundFromRawUrl = (rawUrl: string) => {
    const normalized = normalizeExternalImageUrl(rawUrl)
    if (!normalized) {
      setMessage({ type: 'error', text: 'Background image URL is invalid.' })
      return
    }

    setBackgroundImageFile(null)
    setBackgroundImageUrl(normalized)
    setBackgroundImageInputUrl(rawUrl.trim())
    setMessage({ type: 'success', text: 'Background updated from URL/paste.' })
  }

  const addStickerFromUrl = (rawUrl: string, x?: number, y?: number, label?: string) => {
    const normalized = normalizeExternalImageUrl(rawUrl)
    if (!normalized) {
      setMessage({ type: 'error', text: 'Sticker URL is invalid.' })
      return false
    }

    handleAddStickerToCanvas(
      {
        name: label || 'Pasted Sticker',
        url: normalized,
      },
      x,
      y
    )
    return true
  }

  const extractImagePayload = (dataTransfer: DataTransfer) => {
    const file = Array.from(dataTransfer.files).find(item => item.type.startsWith('image/'))
    if (file) {
      return { kind: 'file' as const, file }
    }

    const html = dataTransfer.getData('text/html')
    const htmlImageUrl = html ? extractImageUrlFromHtml(html) : ''
    if (htmlImageUrl) {
      return { kind: 'url' as const, url: htmlImageUrl }
    }

    const uriList = dataTransfer.getData('text/uri-list')
    if (uriList) {
      const first = uriList.split('\n').find(line => line && !line.startsWith('#')) || ''
      if (first) {
        return { kind: 'url' as const, url: first }
      }
    }

    const plain = dataTransfer.getData('text/plain').trim()
    if (plain) {
      return { kind: 'url' as const, url: plain }
    }

    return null
  }

  const handlePointerMove = useCallback((event: PointerEvent) => {
    const dragState = dragStateRef.current
    const canvas = canvasRef.current
    if (!dragState || !canvas) return

    const bounds = canvas.getBoundingClientRect()
    const rawX = event.clientX - bounds.left - dragState.offsetX
    const rawY = event.clientY - bounds.top - dragState.offsetY

    setCanvasStickers(prev =>
      prev.map(sticker => {
        if (sticker.id !== dragState.id) return sticker
        const x = clamp(rawX, 0, canvasSize.width - sticker.size)
        const y = clamp(rawY, 0, canvasSize.height - sticker.size)
        return { ...sticker, x, y }
      })
    )
  }, [canvasSize.height, canvasSize.width])

  const stopDrag = useCallback(() => {
    dragStateRef.current = null
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', stopDrag)
    window.removeEventListener('pointercancel', stopDrag)
  }, [handlePointerMove])

  const handleSlotPointerMove = useCallback((event: PointerEvent) => {
    const dragState = slotDragStateRef.current
    const canvas = canvasRef.current
    if (!dragState || !canvas) return

    const bounds = canvas.getBoundingClientRect()
    const rawX = event.clientX - bounds.left - dragState.offsetX
    const rawY = event.clientY - bounds.top - dragState.offsetY

    setPhotoSlots(prev =>
      prev.map((slot, index) => {
        if (index !== dragState.index) return slot
        return {
          ...slot,
          x: clamp(rawX, 0, canvasSize.width - slot.width),
          y: clamp(rawY, 0, canvasSize.height - slot.height),
        }
      })
    )
  }, [canvasSize.height, canvasSize.width])

  const stopSlotDrag = useCallback(() => {
    slotDragStateRef.current = null
    window.removeEventListener('pointermove', handleSlotPointerMove)
    window.removeEventListener('pointerup', stopSlotDrag)
    window.removeEventListener('pointercancel', stopSlotDrag)
  }, [handleSlotPointerMove])

  const handleResizePointerMove = useCallback((event: PointerEvent) => {
    const state = resizeStateRef.current
    if (!state) return

    const dx = event.clientX - state.startX
    const dy = event.clientY - state.startY
    const delta = Math.max(dx, dy)
    const nextSize = clamp(state.startSize + delta, 24, 420)

    setCanvasStickers(prev =>
      prev.map(sticker => {
        if (sticker.id !== state.id) return sticker
        return {
          ...sticker,
          size: nextSize,
          x: clamp(sticker.x, 0, Math.max(canvasSize.width - nextSize, 0)),
          y: clamp(sticker.y, 0, Math.max(canvasSize.height - nextSize, 0)),
        }
      })
    )
  }, [canvasSize.height, canvasSize.width])

  const stopResize = useCallback(() => {
    resizeStateRef.current = null
    window.removeEventListener('pointermove', handleResizePointerMove)
    window.removeEventListener('pointerup', stopResize)
    window.removeEventListener('pointercancel', stopResize)
  }, [handleResizePointerMove])

  const handleRotatePointerMove = useCallback((event: PointerEvent) => {
    const state = rotateStateRef.current
    if (!state) return

    const currentAngle = Math.atan2(event.clientY - state.centerY, event.clientX - state.centerX)
    const deltaDeg = ((currentAngle - state.startAngle) * 180) / Math.PI
    const nextRotate = state.startRotate + deltaDeg

    setCanvasStickers(prev =>
      prev.map(sticker => {
        if (sticker.id !== state.id) return sticker
        return {
          ...sticker,
          rotate: nextRotate,
        }
      })
    )
  }, [])

  const stopRotate = useCallback(() => {
    rotateStateRef.current = null
    window.removeEventListener('pointermove', handleRotatePointerMove)
    window.removeEventListener('pointerup', stopRotate)
    window.removeEventListener('pointercancel', stopRotate)
  }, [handleRotatePointerMove])

  const startDragSticker = (stickerId: string) => (event: React.PointerEvent<HTMLButtonElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const sticker = canvasStickers.find(item => item.id === stickerId)
    if (!sticker) return

    const bounds = canvas.getBoundingClientRect()
    dragStateRef.current = {
      id: stickerId,
      offsetX: event.clientX - bounds.left - sticker.x,
      offsetY: event.clientY - bounds.top - sticker.y,
    }

    setSelectedStickerId(stickerId)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', stopDrag)
    window.addEventListener('pointercancel', stopDrag)
  }

  const startSlotDrag = (slotIndex: number) => (event: React.PointerEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const slot = photoSlots[slotIndex]
    if (!slot) return

    const bounds = canvas.getBoundingClientRect()
    slotDragStateRef.current = {
      index: slotIndex,
      offsetX: event.clientX - bounds.left - slot.x,
      offsetY: event.clientY - bounds.top - slot.y,
    }

    setHasCustomSlots(true)
    setSelectedSlotIndex(slotIndex)
    window.addEventListener('pointermove', handleSlotPointerMove)
    window.addEventListener('pointerup', stopSlotDrag)
    window.addEventListener('pointercancel', stopSlotDrag)
  }

  useEffect(() => {
    return () => {
      stopDrag()
      stopSlotDrag()
      stopResize()
      stopRotate()
    }
  }, [stopDrag, stopRotate, stopResize, stopSlotDrag])

  useEffect(() => {
    setCanvasStickers(prev =>
      prev.map(sticker => ({
        ...sticker,
        x: clamp(sticker.x, 0, Math.max(canvasSize.width - sticker.size, 0)),
        y: clamp(sticker.y, 0, Math.max(canvasSize.height - sticker.size, 0)),
      }))
    )
  }, [canvasSize.height, canvasSize.width])

  const handleAddStickerToCanvas = (item: StickerItem, targetX?: number, targetY?: number) => {
    const baseSize = 80
    const centeredX = targetX ?? canvasSize.width / 2 - baseSize / 2
    const centeredY = targetY ?? canvasSize.height / 2 - baseSize / 2

    const newSticker: CanvasSticker = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      src: item.url,
      originalSrc: item.url,
      label: item.name,
      x: clamp(centeredX, 0, Math.max(canvasSize.width - baseSize, 0)),
      y: clamp(centeredY, 0, Math.max(canvasSize.height - baseSize, 0)),
      size: baseSize,
      rotate: 0,
      removeBg: false,
      z: Date.now(),
    }

    setCanvasStickers(prev => [...prev, newSticker])
    setSelectedStickerId(newSticker.id)
  }

  const updateStickerById = (id: string, patch: Partial<CanvasSticker>) => {
    setCanvasStickers(prev =>
      prev.map(sticker => {
        if (sticker.id !== id) return sticker

        const nextSize = patch.size ?? sticker.size
        const nextX = clamp(patch.x ?? sticker.x, 0, Math.max(canvasSize.width - nextSize, 0))
        const nextY = clamp(patch.y ?? sticker.y, 0, Math.max(canvasSize.height - nextSize, 0))

        return {
          ...sticker,
          ...patch,
          x: nextX,
          y: nextY,
        }
      })
    )
  }

  const startResizeSticker = (id: string) => (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const sticker = canvasStickers.find(item => item.id === id)
    if (!sticker) return

    resizeStateRef.current = {
      id,
      startX: event.clientX,
      startY: event.clientY,
      startSize: sticker.size,
    }

    window.addEventListener('pointermove', handleResizePointerMove)
    window.addEventListener('pointerup', stopResize)
    window.addEventListener('pointercancel', stopResize)
  }

  const startRotateSticker = (id: string) => (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const sticker = canvasStickers.find(item => item.id === id)
    const bounds = canvasRef.current?.getBoundingClientRect()
    if (!sticker || !bounds) return

    const centerX = bounds.left + sticker.x + sticker.size / 2
    const centerY = bounds.top + sticker.y + sticker.size / 2
    const startAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX)

    rotateStateRef.current = {
      id,
      centerX,
      centerY,
      startAngle,
      startRotate: sticker.rotate,
    }

    window.addEventListener('pointermove', handleRotatePointerMove)
    window.addEventListener('pointerup', stopRotate)
    window.addEventListener('pointercancel', stopRotate)
  }

  const removeStickerById = (id: string) => {
    setCanvasStickers(prev => prev.filter(sticker => sticker.id !== id))
    if (selectedStickerId === id) {
      setSelectedStickerId(null)
    }
  }

  const removeImageBackground = async (src: string) => {
    const image = await loadImage(src)
    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth || image.width
    canvas.height = image.naturalHeight || image.height
    const ctx = canvas.getContext('2d')
    if (!ctx) return src

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
    return canvas.toDataURL('image/png')
  }

  const toggleStickerRemoveBg = async (id: string) => {
    const target = canvasStickers.find(item => item.id === id)
    if (!target) return

    if (target.removeBg) {
      updateStickerById(id, { src: target.originalSrc, removeBg: false })
      return
    }

    try {
      const processed = await removeImageBackground(target.originalSrc)
      updateStickerById(id, { src: processed, removeBg: true })
      setMessage({ type: 'success', text: 'Remove BG has been applied to sticker.' })
    } catch {
      setMessage({ type: 'error', text: 'Failed to remove sticker background.' })
    }
  }

  const moveStickerLayer = (id: string, direction: 'up' | 'down') => {
    setCanvasStickers(prev => {
      const ordered = [...prev].sort((a, b) => a.z - b.z)
      const index = ordered.findIndex(item => item.id === id)
      if (index < 0) return prev

      const target = direction === 'up' ? index + 1 : index - 1
      if (target < 0 || target >= ordered.length) return prev

      const currentZ = ordered[index].z
      ordered[index].z = ordered[target].z
      ordered[target].z = currentZ
      return ordered
    })
  }

  const handleStickerLibraryDragStart = (event: React.DragEvent<HTMLButtonElement>, sticker: StickerItem) => {
    event.dataTransfer.setData('application/photobooth-sticker', JSON.stringify({ name: sticker.name, url: sticker.url }))
    event.dataTransfer.effectAllowed = 'copy'
  }

  const handleCanvasDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
  }

  const handleCanvasDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()

    const raw = event.dataTransfer.getData('application/photobooth-sticker')
    const bounds = canvasRef.current?.getBoundingClientRect()
    const dropX = bounds ? event.clientX - bounds.left - 40 : undefined
    const dropY = bounds ? event.clientY - bounds.top - 40 : undefined

    if (!raw) {
      const payload = extractImagePayload(event.dataTransfer)
      if (!payload) return

      if (payload.kind === 'file') {
        const objectUrl = URL.createObjectURL(payload.file)
        handleAddStickerToCanvas(
          {
            name: payload.file.name || 'Dropped Sticker',
            url: objectUrl,
          },
          dropX,
          dropY
        )
      } else {
        addStickerFromUrl(payload.url, dropX, dropY, 'Dropped Sticker')
      }
      return
    }

    try {
      const parsed = JSON.parse(raw) as { name?: string; url?: string }
      if (!parsed?.url) return

      handleAddStickerToCanvas(
        {
          name: parsed.name || 'Sticker',
          url: parsed.url,
        },
        dropX,
        dropY
      )
    } catch {
      // Ignore invalid drag payload
    }
  }

  const handleCanvasPaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const payload = extractImagePayload(event.clipboardData)
    if (!payload) return

    event.preventDefault()

    if (payload.kind === 'file') {
      const objectUrl = URL.createObjectURL(payload.file)
      handleAddStickerToCanvas({ name: payload.file.name || 'Pasted Sticker', url: objectUrl })
      return
    }

    addStickerFromUrl(payload.url, undefined, undefined, 'Pasted Sticker')
  }

  const handleBackgroundDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const payload = extractImagePayload(event.dataTransfer)
    if (!payload) return

    if (payload.kind === 'file') {
      setBackgroundFromFile(payload.file)
      return
    }

    setBackgroundFromRawUrl(payload.url)
  }

  const handleBackgroundPaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const payload = extractImagePayload(event.clipboardData)
    if (!payload) return

    event.preventDefault()
    if (payload.kind === 'file') {
      setBackgroundFromFile(payload.file)
      return
    }

    setBackgroundFromRawUrl(payload.url)
  }

  const resetCanvas = () => {
    setBackgroundColor('#ffffff')
    setBackgroundImageFile(null)
    setBackgroundImageInputUrl('')
    setCanvasStickers([])
    setSelectedStickerId(null)
    setCanvasSizeOverride(null)
    setHasCustomSlots(false)
    setMessage(null)
  }

  const exportTemplateImages = async () => {
    const scale = 2
    const width = canvasSize.width * scale
    const height = canvasSize.height * scale

    const frameCanvas = document.createElement('canvas')
    frameCanvas.width = width
    frameCanvas.height = height
    const frameCtx = frameCanvas.getContext('2d')
    if (!frameCtx) throw new Error('Failed to create frame canvas.')

    frameCtx.scale(scale, scale)
    frameCtx.fillStyle = backgroundColor
    frameCtx.fillRect(0, 0, canvasSize.width, canvasSize.height)

    if (backgroundImageUrl) {
      const bgImage = await loadImage(backgroundImageUrl)
      drawCoverImage(frameCtx, bgImage, canvasSize.width, canvasSize.height)
    }

    // Slot guides are editor-only visual helpers and must not be baked into exported frame image.

    const stickerCanvas = document.createElement('canvas')
    stickerCanvas.width = width
    stickerCanvas.height = height
    const stickerCtx = stickerCanvas.getContext('2d')
    if (!stickerCtx) throw new Error('Failed to create sticker canvas.')
    stickerCtx.scale(scale, scale)

    for (const sticker of [...canvasStickers].sort((a, b) => a.z - b.z)) {
      const stickerImage = await loadImage(sticker.src)
      const cx = sticker.x + sticker.size / 2
      const cy = sticker.y + sticker.size / 2

      stickerCtx.save()
      stickerCtx.translate(cx, cy)
      stickerCtx.rotate((sticker.rotate * Math.PI) / 180)
      stickerCtx.drawImage(stickerImage, -sticker.size / 2, -sticker.size / 2, sticker.size, sticker.size)
      stickerCtx.restore()
    }

    const frameBlob = await new Promise<Blob | null>(resolve => frameCanvas.toBlob(resolve, 'image/png'))
    const stickerBlob = await new Promise<Blob | null>(resolve => stickerCanvas.toBlob(resolve, 'image/png'))

    if (!frameBlob || !stickerBlob) {
      throw new Error('Failed to export template images.')
    }

    return { frameBlob, stickerBlob }
  }

  const handleSaveTemplate = async () => {
    setMessage(null)
    setUploading(true)

    try {
      const name = templateName.trim() || `template-${Date.now()}`
      const { frameBlob, stickerBlob } = await exportTemplateImages()

      const templateSettings: TemplateSettings = {
        canvasWidth: canvasSize.width,
        canvasHeight: canvasSize.height,
        padding: CANVAS_PADDING,
        gap: CANVAS_GAP,
        bottomSpace: 0,
        frameBorderRadius: 0,
        photoBorderRadius: 0,
        photoWidth: Math.round(layout.photoWidth),
        photoHeight: Math.round(layout.photoHeight),
        slotCount,
        photoSlots: photoSlots.map(slot => ({
          x: Math.round(slot.x),
          y: Math.round(slot.y),
          width: Math.round(slot.width),
          height: Math.round(slot.height),
        })),
      }

      const formData = new FormData()
      formData.append('name', name)
      formData.append('frame', new File([frameBlob], `${name}-frame.png`, { type: 'image/png' }))
      formData.append('sticker', new File([stickerBlob], `${name}-sticker.png`, { type: 'image/png' }))
      formData.append('settings', JSON.stringify(templateSettings))

      const isEditing = Boolean(editingTemplateName)
      if (isEditing && editingTemplateName) {
        formData.append('currentName', editingTemplateName)
      }

      const res = await fetch(isEditing ? '/api/update-frame-template' : '/api/upload-frame-template', {
        method: isEditing ? 'PATCH' : 'POST',
        body: formData,
      })
      const data = await res.json()

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Failed to save template.' })
        return
      }

      setMessage({ type: 'success', text: `Template ${name} saved successfully.` })
      if (isEditing) {
        setEditingTemplateName(name)
      } else {
        setTemplateName('')
      }
      window.dispatchEvent(new Event('frameTemplatesUpdated'))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while saving template.'
      setMessage({ type: 'error', text: errorMessage })
    } finally {
      setUploading(false)
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
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#4f3040]">Frame Template Canvas</h1>
            <p className="text-sm sm:text-base text-[#705362] mt-1">
              {editingTemplateName
                ? `Editing template ${editingTemplateName}. Update canvas and save changes.`
                : 'Create templates on strip canvas: adjust background, add stickers, then save.'}
            </p>
          </div>
          <Link
            href="/admin/frame-template/list"
            className="inline-flex items-center justify-center rounded-lg border border-[#e7a0c2] bg-[#fff3f9] px-4 py-2 font-semibold text-[#6d3f55] hover:bg-[#ffe7f2]"
          >
            View Template List
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

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-6">
          <section className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-[#f3d7e5]">
            <h2 className="text-xl font-semibold text-[#4f3040] mb-4">Photo Strip Canvas</h2>
            <p className="text-xs text-[#7d5f6d] mb-4">
              Drag stickers directly on canvas to set position. These elements will be used as template overlay.
            </p>

            <div className="w-full overflow-auto rounded-xl border border-[#ecd4e1] bg-[#fff7fb] p-3 flex justify-center">
              <div
                ref={canvasRef}
                className="relative shrink-0 rounded-xl border border-[#f0d8e5] overflow-hidden"
                tabIndex={0}
                onDragOver={handleCanvasDragOver}
                onDrop={handleCanvasDrop}
                onPaste={handleCanvasPaste}
                style={{
                  width: canvasSize.width,
                  height: canvasSize.height,
                  backgroundColor,
                  backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {photoSlots.map((slot, index) => {
                  return (
                    <div
                      key={`placeholder-${index}`}
                      className={`absolute border rounded-md flex items-center justify-center cursor-move touch-none select-none ${
                        selectedSlotIndex === index ? 'border-[#d72688] ring-2 ring-[#f7aed0]' : 'border-white/70'
                      }`}
                      onPointerDown={startSlotDrag(index)}
                      style={{
                        left: slot.x,
                        top: slot.y,
                        width: slot.width,
                        height: slot.height,
                        backgroundColor,
                        zIndex: 2,
                      }}
                    >
                      <span className="text-[11px] font-semibold text-[#9a6c82]">Photo Slot {index + 1}</span>
                    </div>
                  )
                })}

                {[...canvasStickers].sort((a, b) => a.z - b.z).map(sticker => (
                  <div key={sticker.id} style={{ position: 'absolute', left: sticker.x, top: sticker.y, zIndex: 5 }}>
                    <button
                      type="button"
                      onPointerDown={startDragSticker(sticker.id)}
                      onClick={() => setSelectedStickerId(sticker.id)}
                      className={`touch-none rounded-md ${selectedStickerId === sticker.id ? 'ring-2 ring-[#d72688]' : ''}`}
                      style={{
                        width: sticker.size,
                        height: sticker.size,
                        transform: `rotate(${sticker.rotate}deg)`,
                        cursor: 'grab',
                        background: 'transparent',
                        padding: 0,
                      }}
                      title={sticker.label}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={sticker.src} alt={sticker.label} className="w-full h-full object-contain pointer-events-none" />
                    </button>

                    {selectedStickerId === sticker.id && (
                      <>
                        <button
                          type="button"
                          className="absolute -top-3 -left-3 h-6 w-6 rounded-full bg-white border border-[#f3b7d1] text-[#d72688] text-[10px] font-bold shadow"
                          onPointerDown={event => {
                            event.stopPropagation()
                            moveStickerLayer(sticker.id, 'up')
                          }}
                          title="Move Layer Up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className="absolute -bottom-3 -left-3 h-6 w-6 rounded-full bg-white border border-[#f3b7d1] text-[#d72688] text-[10px] font-bold shadow"
                          onPointerDown={event => {
                            event.stopPropagation()
                            moveStickerLayer(sticker.id, 'down')
                          }}
                          title="Move Layer Down"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          className="absolute -top-3 left-1/2 -translate-x-1/2 h-6 px-2 rounded-full bg-white border border-[#f3b7d1] text-[#d72688] text-[9px] font-bold shadow"
                          onPointerDown={event => {
                            event.stopPropagation()
                            void toggleStickerRemoveBg(sticker.id)
                          }}
                          title="Remove Background"
                        >
                          {sticker.removeBg ? 'BG ON' : 'BG OFF'}
                        </button>
                        <button
                          type="button"
                          className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-[#ffe9f2] border border-[#f3b7d1] text-[#c42874] text-[12px] font-bold shadow"
                          onPointerDown={event => {
                            event.stopPropagation()
                            removeStickerById(sticker.id)
                          }}
                          title="Delete"
                        >
                          ×
                        </button>

                        <button
                          type="button"
                          className="absolute top-1/2 -right-3 -translate-y-1/2 h-6 w-6 rounded-full bg-white border border-[#f3b7d1] text-[#d72688] text-[10px] font-bold shadow"
                          onPointerDown={startRotateSticker(sticker.id)}
                          title="Rotate (drag pointer)"
                        >
                          ⟳
                        </button>

                        <button
                          type="button"
                          className="absolute -bottom-3 -right-3 h-6 w-6 rounded-full bg-white border border-[#f3b7d1] text-[#d72688] text-[10px] font-bold shadow"
                          onPointerDown={startResizeSticker(sticker.id)}
                          title="Resize (drag pointer)"
                        >
                          ↘
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-[#ecd4e1] bg-[#fff7fb] p-3">
              <p className="text-xs text-[#6d3f55]">Click a sticker, then drag top-right handle to rotate and bottom-right handle to resize. Use BG button for background removal.</p>
            </div>
          </section>

          <div className="space-y-6">
            <section className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-[#f3d7e5] h-fit">
              <h2 className="text-xl font-semibold text-[#4f3040] mb-4">Template Settings</h2>

              {loadingTemplate && (
                <div className="mb-3 rounded-lg border border-[#ecd4e1] bg-[#fff7fb] px-3 py-2 text-xs text-[#6d3f55]">
                  Loading template data...
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="template-name" className="block text-sm font-medium text-[#5d4150] mb-1">
                    Template Name
                  </label>
                  <input
                    id="template-name"
                    type="text"
                    value={templateName}
                    onChange={event => setTemplateName(event.target.value)}
                    placeholder="example: garlet-pink"
                    className="w-full rounded-lg border border-[#d9c8d1] bg-white px-3 py-2 text-sm text-[#4a2337] placeholder:text-[#a48394] focus:outline-none focus:ring-2 focus:ring-[#f2aacb]"
                  />
                </div>

                <div>
                  <label htmlFor="background-color" className="block text-sm font-medium text-[#5d4150] mb-1">
                    Background Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="background-color"
                      type="color"
                      value={backgroundColor}
                      onChange={event => setBackgroundColor(event.target.value)}
                      className="h-10 w-14 cursor-pointer rounded border border-[#d9c8d1] bg-white p-1"
                    />
                    <input
                      type="text"
                      value={backgroundColor}
                      onChange={event => setBackgroundColor(event.target.value)}
                      className="flex-1 rounded-lg border border-[#d9c8d1] bg-white px-3 py-2 text-sm text-[#4a2337] focus:outline-none focus:ring-2 focus:ring-[#f2aacb]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="slot-count" className="block text-sm font-medium text-[#5d4150] mb-1">
                    Number of Photo Slots
                  </label>
                  <select
                    id="slot-count"
                    value={slotCount}
                    onChange={event => {
                      setCanvasSizeOverride(null)
                      setHasCustomSlots(false)
                      setSlotCount(Number(event.target.value) as SlotCount)
                    }}
                    className="w-full rounded-lg border border-[#d9c8d1] bg-white px-3 py-2 text-sm text-[#4a2337] focus:outline-none focus:ring-2 focus:ring-[#f2aacb]"
                  >
                    {SLOT_COUNT_OPTIONS.map(option => (
                      <option key={option} value={option}>
                        {option} Photos
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="canvas-format" className="block text-sm font-medium text-[#5d4150] mb-1">
                    Format Canvas
                  </label>
                  <select
                    id="canvas-format"
                    value={canvasFormat}
                    onChange={event => {
                      setCanvasSizeOverride(null)
                      setHasCustomSlots(false)
                      setCanvasFormat(event.target.value as CanvasFormat)
                    }}
                    className="w-full rounded-lg border border-[#d9c8d1] bg-white px-3 py-2 text-sm text-[#4a2337] focus:outline-none focus:ring-2 focus:ring-[#f2aacb]"
                  >
                    {(Object.keys(FORMAT_PRESETS) as CanvasFormat[]).map(format => (
                      <option key={format} value={format}>
                        {FORMAT_PRESETS[format].label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-[#8e6f7f]">
                    Canvas: {canvasSize.width} x {canvasSize.height}px, Grid: {layout.columns} columns x {layout.rows} rows
                  </p>
                </div>

                <div>
                  <label htmlFor="background-image" className="block text-sm font-medium text-[#5d4150] mb-1">
                    Background Image (optional)
                  </label>
                  <input
                    id="background-image"
                    type="file"
                    accept="image/*"
                    onChange={event => setBackgroundImageFile(event.target.files?.[0] || null)}
                    className="w-full rounded-lg border border-[#d9c8d1] bg-white px-3 py-2 text-sm text-[#4a2337]"
                  />
                  <div
                    className="mt-2 rounded-lg border border-dashed border-[#e7a0c2] bg-[#fff7fb] px-3 py-2 text-xs text-[#6d3f55] outline-none"
                    tabIndex={0}
                    onDragOver={event => {
                      event.preventDefault()
                      event.dataTransfer.dropEffect = 'copy'
                    }}
                    onDrop={handleBackgroundDrop}
                    onPaste={handleBackgroundPaste}
                  >
                    Drag/drop or paste image for Background (automatically placed in back layer).
                  </div>
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={backgroundImageInputUrl}
                      onChange={event => setBackgroundImageInputUrl(event.target.value)}
                      placeholder="Paste image URL from Google/website"
                      className="flex-1 rounded-lg border border-[#d9c8d1] bg-white px-3 py-2 text-sm text-[#4a2337] focus:outline-none focus:ring-2 focus:ring-[#f2aacb]"
                    />
                    <button
                      type="button"
                      onClick={() => setBackgroundFromRawUrl(backgroundImageInputUrl)}
                      className="rounded-lg border border-[#e7a0c2] bg-[#fff3f9] px-3 py-2 text-xs font-semibold text-[#6d3f55] hover:bg-[#ffe7f2]"
                    >
                      Use URL
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={resetCanvas}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#e7a0c2] bg-[#fff3f9] px-4 py-2 font-semibold text-[#6d3f55] hover:bg-[#ffe7f2]"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveTemplate}
                    disabled={uploading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#e7a0c2] bg-[#f8bfd7] px-4 py-2 font-semibold text-[#4a2337] hover:bg-[#f2aacb] disabled:opacity-60"
                  >
                    <Save className="w-4 h-4" />
                    {uploading ? 'Saving...' : editingTemplateName ? 'Update Template' : 'Save Template'}
                  </button>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-[#f3d7e5] h-fit">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#4f3040]">Sticker Library</h2>
                <button
                  type="button"
                  onClick={() => fetchStickers(true)}
                  disabled={refreshingStickers}
                  className="inline-flex items-center gap-1 rounded-md border border-[#e7a0c2] bg-[#fff3f9] px-2.5 py-1 text-xs font-semibold text-[#6d3f55] hover:bg-[#ffe7f2]"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshingStickers ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              {loadingStickers ? (
                <p className="text-sm text-gray-500">Loading stickers...</p>
              ) : stickers.length === 0 ? (
                <p className="text-sm text-gray-500">No stickers yet. Add stickers first from Sticker menu.</p>
              ) : (
                <div className="grid grid-cols-2 gap-3 max-h-[560px] overflow-auto pr-1">
                  {stickers.map(sticker => (
                    <button
                      key={sticker.objectName || sticker.url}
                      type="button"
                      onClick={() => handleAddStickerToCanvas(sticker)}
                      draggable
                      onDragStart={event => handleStickerLibraryDragStart(event, sticker)}
                      className="rounded-lg border border-[#ecd4e1] bg-[#fff7fb] p-2 hover:border-[#f2aacb] hover:bg-white transition text-left"
                      title={`Add ${sticker.name}`}
                    >
                      <div className="rounded-md bg-white border border-[#f0e2e8] aspect-square flex items-center justify-center overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={sticker.url} alt={sticker.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="mt-1 text-[11px] text-[#6d3f55] truncate font-semibold">{sticker.name}</div>
                      <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-[#d72688] font-semibold">
                        <Plus className="w-3 h-3" />
                        Add
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-4 rounded-lg border border-[#ecd4e1] bg-[#fff7fb] p-3 text-xs text-[#6d3f55]">
                <p className="font-semibold mb-1">Notes</p>
                <p>Template is saved as frame overlay + sticker overlay so it can be used directly in strip editor page.</p>
                <p className="mt-1">Photo slots can be dragged to align photo areas with your template design.</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FrameTemplatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center px-4">
          <p className="text-gray-600">Loading template editor...</p>
        </div>
      }
    >
      <FrameTemplatePageContent />
    </Suspense>
  )
}
