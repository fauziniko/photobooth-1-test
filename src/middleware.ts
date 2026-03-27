import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

const AUTH_SECRET = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? process.env.AUTHJS_SECRET

const readAuthToken = async (request: NextRequest) => {
  const tokenOptions: Parameters<typeof getToken>[0] = {
    req: request,
  }

  if (AUTH_SECRET) {
    tokenOptions.secret = AUTH_SECRET
  }

  return getToken(tokenOptions)
}

const withNoStore = (response: NextResponse) => {
  response.headers.set('Cache-Control', 'private, no-store, no-cache, must-revalidate, max-age=0')
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '0')
  response.headers.set('x-middleware-cache', 'no-cache')
  response.headers.set('Vary', 'Cookie, Next-Router-Prefetch, Purpose, Sec-Purpose, RSC')
  return response
}

const isPrefetchLikeRequest = (request: NextRequest) => {
  const purpose = request.headers.get('purpose')
  const secPurpose = request.headers.get('sec-purpose')
  const nextPrefetch = request.headers.get('next-router-prefetch')
  const isRsc = request.nextUrl.searchParams.has('_rsc') || request.headers.has('rsc')

  return purpose === 'prefetch' || secPurpose === 'prefetch' || nextPrefetch === '1' || isRsc
}

const isProtectedPhotoPage = (pathname: string) => {
  if (pathname === '/photo') {
    return false
  }

  return pathname.startsWith('/photo') || pathname.startsWith('/photo-result')
}

export async function middleware(request: NextRequest) {
  const token = await readAuthToken(request)
  const tokenRole =
    token && typeof token === 'object' && 'role' in token
      ? (token.role as string | undefined)
      : undefined

  const { pathname } = request.nextUrl
  const isPrefetch = isPrefetchLikeRequest(request)

  // Protect all PhotoBooth pages.
  if (isProtectedPhotoPage(pathname)) {
    if (isPrefetch) {
      return withNoStore(new NextResponse(null, { status: 204 }))
    }

    if (!token) {
      const url = new URL('/auth/signin', request.url)
      url.searchParams.set('callbackUrl', `${pathname}${request.nextUrl.search}`)
      return withNoStore(NextResponse.redirect(url))
    }
  }

  // Protect /admin route - requires ADMIN role (registered users)
  if (pathname.startsWith('/admin')) {
    if (isPrefetch) {
      return withNoStore(new NextResponse(null, { status: 204 }))
    }

    if (!token) {
      const url = new URL('/auth/signin', request.url)
      url.searchParams.set('callbackUrl', `${pathname}${request.nextUrl.search}`)
      return withNoStore(NextResponse.redirect(url))
    }
    
    // Only registered users (USER or ADMIN role) can access admin
    // This means only logged-in users can upload
    if (tokenRole !== 'ADMIN' && tokenRole !== 'USER') {
      return withNoStore(NextResponse.redirect(new URL('/', request.url)))
    }
  }

  // Protect upload APIs - requires authentication (any registered user)
  if (
    pathname.startsWith('/api/upload-frame-template') || 
    pathname.startsWith('/api/upload-sticker') ||
    pathname.startsWith('/api/upload-frame-sticker')
  ) {
    if (!token) {
      return withNoStore(NextResponse.json(
        { error: 'Unauthorized. Please login to upload.' },
        { status: 403 }
      ))
    }
    // Any registered user can upload, not just ADMIN
  }

  // Gallery APIs: allow public GET for /api/gallery/:id shared links.
  if (pathname.startsWith('/api/gallery')) {
    const isDetailApiPath = /^\/api\/gallery\/[^/]+$/.test(pathname)
    const isPublicDetailRead = isDetailApiPath && request.method === 'GET'

    if (!token && !isPublicDetailRead) {
      return withNoStore(NextResponse.json(
        { error: 'Unauthorized. Please login first.' },
        { status: 403 }
      ))
    }
  }

  return withNoStore(NextResponse.next())
}

export const config = {
  matcher: [
    '/photo/:path*',
    '/photo-result/:path*',
    '/admin/:path*',
    '/api/gallery/:path*',
    '/api/upload-frame-template/:path*',
    '/api/upload-sticker/:path*',
    '/api/upload-frame-sticker/:path*',
  ],
}

