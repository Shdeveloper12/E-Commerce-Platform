import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || 
                      request.nextUrl.pathname.startsWith('/register')

  // Redirect to login if accessing admin routes without authentication
  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Check if user has admin role
  if (isAdminRoute && token) {
    if (token.role !== 'ADMIN' && token.role !== 'MODERATOR') {
      return NextResponse.redirect(new URL('/account', request.url))
    }
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && token) {
    if (token.role === 'ADMIN' || token.role === 'MODERATOR') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return NextResponse.redirect(new URL('/account', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/register', '/account/:path*']
}
