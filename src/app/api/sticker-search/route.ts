import { NextResponse } from 'next/server'

type Provider = 'iconify' | 'openmoji' | 'emojihub'

type StickerSearchItem = {
  id: string
  provider: Provider
  name: string
  previewUrl: string
  sourceUrl: string
}

const DEFAULT_LIMIT = 24
const MAX_LIMIT = 120
const MAX_QUERY_LENGTH = 80
const OPENMOJI_DATASET_URL = 'https://raw.githubusercontent.com/hfg-gmuend/openmoji/master/data/openmoji.json'
const EMOJIHUB_DATASET_URL = 'https://emojihub.yurace.pro/api/all'
const DATASET_TTL_MS = 1000 * 60 * 60 * 6

type OpenMojiEntry = {
  emoji: string
  name: string
  keywords: string[]
}

type OpenMojiApiEntry = {
  annotation?: string
  tags?: string[]
  group?: string
  subgroups?: string[]
  emoji?: string
  hexcode?: string
}

type EmojiHubEntry = {
  name?: string
  category?: string
  group?: string
  htmlCode?: string[]
  unicode?: string[]
}

let openMojiApiCache: { expiresAt: number; data: OpenMojiApiEntry[] } | null = null
let emojiHubCache: { expiresAt: number; data: EmojiHubEntry[] } | null = null

const OPENMOJI_CATALOG: OpenMojiEntry[] = [
  { emoji: '😀', name: 'grinning face', keywords: ['smile', 'happy', 'emoji'] },
  { emoji: '😂', name: 'face with tears of joy', keywords: ['laugh', 'funny'] },
  { emoji: '😍', name: 'smiling face with heart eyes', keywords: ['love', 'heart'] },
  { emoji: '🥳', name: 'partying face', keywords: ['party', 'celebration', 'birthday'] },
  { emoji: '🤩', name: 'star struck', keywords: ['star', 'wow'] },
  { emoji: '😎', name: 'smiling face with sunglasses', keywords: ['cool', 'summer'] },
  { emoji: '🤗', name: 'hugging face', keywords: ['hug', 'warm'] },
  { emoji: '🎉', name: 'party popper', keywords: ['party', 'confetti', 'celebrate'] },
  { emoji: '🎈', name: 'balloon', keywords: ['party', 'birthday', 'event'] },
  { emoji: '🎂', name: 'birthday cake', keywords: ['cake', 'birthday'] },
  { emoji: '💍', name: 'ring', keywords: ['wedding', 'love'] },
  { emoji: '💐', name: 'bouquet', keywords: ['flower', 'wedding'] },
  { emoji: '❤️', name: 'red heart', keywords: ['love', 'romance', 'heart'] },
  { emoji: '💖', name: 'sparkling heart', keywords: ['love', 'sparkle'] },
  { emoji: '✨', name: 'sparkles', keywords: ['sparkle', 'magic'] },
  { emoji: '🌟', name: 'glowing star', keywords: ['star', 'shine'] },
  { emoji: '⭐', name: 'star', keywords: ['favorite', 'rank'] },
  { emoji: '🔥', name: 'fire', keywords: ['hot', 'trending'] },
  { emoji: '🍀', name: 'four leaf clover', keywords: ['lucky', 'nature'] },
  { emoji: '🌈', name: 'rainbow', keywords: ['colorful', 'sky'] },
  { emoji: '☀️', name: 'sun', keywords: ['sunny', 'weather'] },
  { emoji: '🌙', name: 'crescent moon', keywords: ['night', 'sleep'] },
  { emoji: '☁️', name: 'cloud', keywords: ['weather', 'sky'] },
  { emoji: '❄️', name: 'snowflake', keywords: ['winter', 'cold'] },
  { emoji: '📸', name: 'camera', keywords: ['photo', 'snapshot'] },
  { emoji: '🎬', name: 'clapper board', keywords: ['video', 'movie'] },
  { emoji: '🎵', name: 'musical note', keywords: ['music', 'song'] },
  { emoji: '🎀', name: 'ribbon', keywords: ['gift', 'cute'] },
  { emoji: '🎁', name: 'wrapped gift', keywords: ['gift', 'present'] },
  { emoji: '📍', name: 'round pushpin', keywords: ['location', 'map'] },
  { emoji: '✅', name: 'check mark', keywords: ['done', 'success'] },
  { emoji: '🪄', name: 'magic wand', keywords: ['magic', 'editor'] },
]

const clampLimit = (value: string | null) => {
  const raw = Number.parseInt(value || String(DEFAULT_LIMIT), 10)
  if (Number.isNaN(raw)) return DEFAULT_LIMIT
  return Math.max(1, Math.min(raw, MAX_LIMIT))
}

const parseProvider = (value: string | null): Provider | null => {
  const normalized = (value || 'iconify').toLowerCase().trim()
  if (normalized === 'iconify' || normalized === 'openmoji' || normalized === 'emojihub') {
    return normalized
  }
  return null
}

const sanitizeQuery = (value: string | null) => (value || '').trim().slice(0, MAX_QUERY_LENGTH)

const normalize = (value: string) => value.toLowerCase().trim()

const emojiToCodepoint = (emoji: string) =>
  [...emoji]
    .map(char => char.codePointAt(0)?.toString(16).toUpperCase() || '')
    .filter(Boolean)
    .join('-')

const unicodeToCodepoint = (unicode: string) =>
  unicode
    .replace(/^U\+/i, '')
    .replace(/\s+/g, '')
    .toUpperCase()

const normalizeTerms = (...terms: Array<string | string[] | undefined>) => {
  const out: string[] = []
  for (const term of terms) {
    if (!term) continue
    if (Array.isArray(term)) {
      term.forEach(entry => {
        if (typeof entry === 'string' && entry.trim()) out.push(entry.trim().toLowerCase())
      })
      continue
    }
    if (typeof term === 'string' && term.trim()) out.push(term.trim().toLowerCase())
  }
  return out.join(' ')
}

const fetchOpenMojiApiDataset = async (): Promise<OpenMojiApiEntry[]> => {
  const now = Date.now()
  if (openMojiApiCache && openMojiApiCache.expiresAt > now) {
    return openMojiApiCache.data
  }

  const response = await fetch(OPENMOJI_DATASET_URL, {
    cache: 'no-store',
    signal: AbortSignal.timeout(7000),
  })
  if (!response.ok) {
    throw new Error(`OpenMoji dataset request failed with status ${response.status}`)
  }

  const payload = await response.json()
  const data = Array.isArray(payload) ? payload : []
  openMojiApiCache = {
    data,
    expiresAt: now + DATASET_TTL_MS,
  }
  return data
}

const fetchEmojiHubDataset = async (): Promise<EmojiHubEntry[]> => {
  const now = Date.now()
  if (emojiHubCache && emojiHubCache.expiresAt > now) {
    return emojiHubCache.data
  }

  const response = await fetch(EMOJIHUB_DATASET_URL, {
    cache: 'no-store',
    signal: AbortSignal.timeout(7000),
  })
  if (!response.ok) {
    throw new Error(`EmojiHub dataset request failed with status ${response.status}`)
  }

  const payload = await response.json()
  const data = Array.isArray(payload) ? payload : []
  emojiHubCache = {
    data,
    expiresAt: now + DATASET_TTL_MS,
  }
  return data
}

const searchOpenMoji = (query: string, limit: number): StickerSearchItem[] => {
  const normalizedQuery = normalize(query)

  const filtered = OPENMOJI_CATALOG.filter(item => {
    if (!normalizedQuery) return true
    if (normalize(item.name).includes(normalizedQuery)) return true
    return item.keywords.some(keyword => normalize(keyword).includes(normalizedQuery))
  }).slice(0, limit)

  return filtered.map(item => {
    const codepoint = emojiToCodepoint(item.emoji)
    const sourceUrl = `https://cdn.jsdelivr.net/npm/openmoji@14.0.0/color/svg/${codepoint}.svg`

    return {
      id: `openmoji:${codepoint}`,
      provider: 'openmoji' as const,
      name: item.name,
      previewUrl: sourceUrl,
      sourceUrl,
    }
  })
}

const searchOpenMojiApi = async (query: string, limit: number): Promise<StickerSearchItem[]> => {
  const dataset = await fetchOpenMojiApiDataset()
  const normalizedQuery = normalize(query)

  const filtered = dataset
    .filter(entry => {
      if (!entry?.hexcode) return false
      if (!normalizedQuery) return true

      const haystack = normalizeTerms(
        entry.annotation,
        entry.tags,
        entry.group,
        entry.subgroups
      )
      return haystack.includes(normalizedQuery)
    })
    .slice(0, limit)

  return filtered.map(entry => {
    const normalizedCodepoint = String(entry.hexcode || '').toUpperCase()
    const sourceUrl = `https://cdn.jsdelivr.net/npm/openmoji@14.0.0/color/svg/${normalizedCodepoint}.svg`

    return {
      id: `openmoji:${normalizedCodepoint}`,
      provider: 'openmoji' as const,
      name: entry.annotation || entry.emoji || normalizedCodepoint,
      previewUrl: sourceUrl,
      sourceUrl,
    }
  })
}

const searchEmojiHub = async (query: string, limit: number): Promise<StickerSearchItem[]> => {
  const dataset = await fetchEmojiHubDataset()
  const normalizedQuery = normalize(query)

  const filtered = dataset
    .filter(entry => {
      const code = entry?.unicode?.[0]
      if (!code) return false
      if (!normalizedQuery) return true

      const haystack = normalizeTerms(entry.name, entry.category, entry.group)
      return haystack.includes(normalizedQuery)
    })
    .slice(0, limit)

  const mapped: Array<StickerSearchItem | null> = filtered
    .map(entry => {
      const code = entry?.unicode?.[0]
      if (!code) return null

      const codepoint = unicodeToCodepoint(code).toLowerCase()
      if (!codepoint) return null

      const sourceUrl = `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${codepoint}.svg`
      return {
        id: `emojihub:${codepoint}`,
        provider: 'emojihub' as const,
        name: entry.name || codepoint,
        previewUrl: sourceUrl,
        sourceUrl,
      }
    })

  return mapped.filter((item): item is StickerSearchItem => item !== null)
}

const searchIconify = async (query: string, limit: number): Promise<StickerSearchItem[]> => {
  const normalizedQuery = query.trim() || 'sparkle'
  const url = `https://api.iconify.design/search?query=${encodeURIComponent(normalizedQuery)}&limit=${limit}`
  const response = await fetch(url, {
    cache: 'no-store',
    signal: AbortSignal.timeout(5000),
  })

  if (!response.ok) {
    throw new Error(`Iconify request failed with status ${response.status}`)
  }

  const payload = await response.json()
  const icons = Array.isArray(payload?.icons) ? payload.icons.filter((item: unknown): item is string => typeof item === 'string') : []

  return icons.slice(0, limit).map((icon: string) => {
    const sourceUrl = `https://api.iconify.design/${encodeURIComponent(icon)}.svg`
    const iconName = icon.split(':').pop() || icon

    return {
      id: `iconify:${icon}`,
      provider: 'iconify' as const,
      name: iconName.replace(/[-_]+/g, ' '),
      previewUrl: sourceUrl,
      sourceUrl,
    }
  })
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const provider = parseProvider(searchParams.get('provider'))
    const query = sanitizeQuery(searchParams.get('q'))
    const limit = clampLimit(searchParams.get('limit'))

    if (!provider) {
      return NextResponse.json({ error: 'Unsupported provider. Use iconify, openmoji, or emojihub.' }, { status: 400 })
    }

    let items: StickerSearchItem[] = []
    let fallbackUsed = false

    if (provider === 'iconify') {
      try {
        items = await searchIconify(query, limit)
      } catch {
        items = searchOpenMoji(query, limit)
        fallbackUsed = true
      }
    } else if (provider === 'openmoji') {
      try {
        items = await searchOpenMojiApi(query, limit)
      } catch {
        items = searchOpenMoji(query, limit)
        fallbackUsed = true
      }
    } else {
      try {
        items = await searchEmojiHub(query, limit)
      } catch {
        items = await searchOpenMojiApi(query, limit)
        fallbackUsed = true
      }
    }

    return NextResponse.json(
      { provider, query, total: items.length, fallbackUsed, items },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
        },
      }
    )
  } catch (error) {
    const includeDebug = process.env.NODE_ENV !== 'production'
    const details = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      includeDebug
        ? { error: 'Failed to search sticker provider.', details }
        : { error: 'Failed to search sticker provider.' },
      { status: 500 }
    )
  }
}
