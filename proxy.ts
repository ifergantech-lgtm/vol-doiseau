import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

export function proxy(request: Parameters<typeof intlMiddleware>[0]) {
  // Skip admin routes — they have no locale prefix
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return
  }
  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!_next|_vercel|api|.*\..*).*)'],
}
