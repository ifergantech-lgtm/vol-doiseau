'use client'

import { useParams, usePathname, useRouter } from 'next/navigation'
import { routing } from '@/i18n/routing'

const labels: Record<string, string> = { he: 'עב', fr: 'FR', en: 'EN' }

export default function LanguageSwitcher() {
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const currentLocale = (params?.locale as string) || routing.defaultLocale

  function switchLocale(locale: string) {
    // Replace the locale segment in the pathname
    const segments = pathname.split('/')
    segments[1] = locale
    router.push(segments.join('/'))
  }

  return (
    <div className="flex items-center gap-1">
      {routing.locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          className={`text-[10px] tracking-widest px-2 py-1 rounded transition-colors ${
            locale === currentLocale
              ? 'text-gold border border-gold/40'
              : 'text-cream/50 hover:text-gold'
          }`}
        >
          {labels[locale]}
        </button>
      ))}
    </div>
  )
}
