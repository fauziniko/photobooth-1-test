import { NextResponse } from 'next/server'

const isBlockedHost = (host: string) => {
  const value = host.toLowerCase()
  return (
    value === 'localhost' ||
    value === '127.0.0.1' ||
    value === '0.0.0.0' ||
    value === '::1' ||
    value.endsWith('.local')
  )
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const rawUrl = searchParams.get('url')

    if (!rawUrl) {
      return NextResponse.json({ error: 'url is required' }, { status: 400 })
    }

    let target: URL
    try {
      target = new URL(rawUrl)
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }

    if (!['http:', 'https:'].includes(target.protocol)) {
      return NextResponse.json({ error: 'Only http/https allowed' }, { status: 400 })
    }

    if (isBlockedHost(target.hostname)) {
      return NextResponse.json({ error: 'Blocked host' }, { status: 403 })
    }

    const response = await fetch(target.toString(), {
      headers: { 'User-Agent': 'Photobooth-ImageProxy/1.0' },
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch (${response.status})` }, { status: 502 })
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.startsWith('image/')) {
      return NextResponse.json({ error: 'URL is not an image resource' }, { status: 400 })
    }

    const data = await response.arrayBuffer()

    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Proxy error', details: message }, { status: 500 })
  }
}
