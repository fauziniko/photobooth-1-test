import { NextResponse } from 'next/server'

type Provider = 'iconify' | 'openmoji'

type OpenMojiEntry = {
  emoji: string
  name: string
  keywords: string[]
}

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
  const raw = Number.parseInt(value || '24', 10)
  if (Number.isNaN(raw)) return 24
  return Math.max(1, Math.min(raw, 50))
}

const normalize = (value: string) => value.toLowerCase().trim()

const emojiToCodepoint = (emoji: string) =>
  [...emoji]
    .map(char => char.codePointAt(0)?.toString(16).toUpperCase() || '')
    .filter(Boolean)
    .join('-')

const searchOpenMoji = (query: string, limit: number) => {
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
      provider: 'openmoji',
      name: item.name,
      previewUrl: sourceUrl,
      sourceUrl,
    }
  })
}

const searchIconify = async (query: string, limit: number) => {
  const normalizedQuery = query.trim() || 'sparkle'
  const url = `https://api.iconify.design/search?query=${encodeURIComponent(normalizedQuery)}&limit=${limit}`
  const response = await fetch(url, { cache: 'no-store' })

  if (!response.ok) {
    throw new Error(`Iconify request failed with status ${response.status}`)
  }

  const payload = await response.json()
  const icons = Array.isArray(payload?.icons) ? payload.icons : []

  return icons.map((icon: string) => {
    const sourceUrl = `https://api.iconify.design/${encodeURIComponent(icon)}.svg`
    const iconName = icon.split(':').pop() || icon

    return {
      id: `iconify:${icon}`,
      provider: 'iconify',
      name: iconName.replace(/[-_]+/g, ' '),
      previewUrl: sourceUrl,
      sourceUrl,
    }
  })
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const provider = (searchParams.get('provider') || 'iconify').toLowerCase() as Provider
    const query = searchParams.get('q') || ''
    const limit = clampLimit(searchParams.get('limit'))

    if (provider !== 'iconify' && provider !== 'openmoji') {
      return NextResponse.json({ error: 'Unsupported provider. Use iconify or openmoji.' }, { status: 400 })
    }

    const items = provider === 'iconify' ? await searchIconify(query, limit) : searchOpenMoji(query, limit)

    return NextResponse.json({ provider, query, total: items.length, items }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to search sticker provider.', details: message }, { status: 500 })
  }
}
