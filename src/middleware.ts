import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  // Get token with proper secret configuration
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === 'production',
  })
  
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || 
                      request.nextUrl.pathname.startsWith('/register')

  // Log for debugging in development (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('Middleware:', {
      path: request.nextUrl.pathname,
      hasToken: !!token,
      role: token?.role,
    })
  }

  const isCheckoutRoute = request.nextUrl.pathname.startsWith('/checkout')
  const isPaymentRoute = request.nextUrl.pathname.startsWith('/payment')
  const isAccountRoute = request.nextUrl.pathname.startsWith('/account')

  // Redirect to login if accessing protected routes without authentication
  if ((isAdminRoute || isCheckoutRoute || isPaymentRoute || isAccountRoute) && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname + request.nextUrl.search)
    return NextResponse.redirect(loginUrl)
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
  matcher: ['/admin/:path*', '/login', '/register', '/account/:path*', '/checkout', '/payment']
}
