import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  })

  const { pathname } = request.nextUrl

  // /photo route is now PUBLIC - no authentication required
  // Anyone can use the photobooth without login

  // Protect /admin route - requires ADMIN role (registered users)
  if (pathname.startsWith('/admin')) {
    if (!token) {
      const url = new URL('/auth/signin', request.url)
      url.searchParams.set('callbackUrl', pathname)
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

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/upload-frame-template/:path*',
    '/api/upload-sticker/:path*',
    '/api/upload-frame-sticker/:path*',
  ],
}

