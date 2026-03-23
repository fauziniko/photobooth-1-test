import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

const AUTH_SECRET = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET

const readAuthToken = async (request: NextRequest) => {
  return getToken({
    req: request,
    secret: AUTH_SECRET,
  })
}

export async function middleware(request: NextRequest) {
  const token = await readAuthToken(request)

  const { pathname } = request.nextUrl

  // Protect all PhotoBooth pages.
  if (pathname.startsWith('/photo') || pathname.startsWith('/photo-result')) {
    if (!token) {
      const url = new URL('/auth/signin', request.url)
      url.searchParams.set('callbackUrl', `${pathname}${request.nextUrl.search}`)
      return NextResponse.redirect(url)
    }
  }

  // Protect /admin route - requires ADMIN role (registered users)
  if (pathname.startsWith('/admin')) {
    if (!token) {
      const url = new URL('/auth/signin', request.url)
      url.searchParams.set('callbackUrl', `${pathname}${request.nextUrl.search}`)
      return NextResponse.redirect(url)
    }
    
    // Only registered users (USER or ADMIN role) can access admin
    // This means only logged-in users can upload
    if (token.role !== 'ADMIN' && token.role !== 'USER') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Protect upload APIs - requires authentication (any registered user)
  if (
    pathname.startsWith('/api/upload-frame-template') || 
    pathname.startsWith('/api/upload-sticker') ||
    pathname.startsWith('/api/upload-frame-sticker')
  ) {
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login to upload.' },
        { status: 403 }
      )
    }
    // Any registered user can upload, not just ADMIN
  }

  // Gallery APIs: allow public GET for /api/gallery/:id shared links.
  if (pathname.startsWith('/api/gallery')) {
    const isDetailApiPath = /^\/api\/gallery\/[^/]+$/.test(pathname)
    const isPublicDetailRead = isDetailApiPath && request.method === 'GET'

    if (!token && !isPublicDetailRead) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login first.' },
        { status: 403 }
      )
    }
  }

  return NextResponse.next()
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

