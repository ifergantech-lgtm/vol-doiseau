import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  try {
    // Skip admin routes — they have no locale prefix
    if (request.nextUrl.pathname.startsWith('/admin')) {
      return NextResponse.next()
    }
    return intlMiddleware(request)
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/((?!_next|_vercel|api|.*\..*).*)'],
}
