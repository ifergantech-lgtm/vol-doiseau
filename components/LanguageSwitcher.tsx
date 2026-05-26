'use client'

import { useParams, usePathname } from 'next/navigation'
import { routing } from '@/i18n/routing'

const labels: Record<string, string> = { he: 'עברית', fr: 'Français', en: 'English' }

export default function LanguageSwitcher() {
  const params = useParams()
  const pathname = usePathname()
  const currentLocale = (params?.locale as string) || routing.defaultLocale

  // Remove the current locale prefix from pathname, then prepend the new one
  // In next-intl with App Router, pathname includes the locale at the beginning
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/$1')

  return (
    <div className="flex items-center gap-1">
      {routing.locales.map((locale) => {
        const newPath = `/${locale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`
        return (
          <a
            key={locale}
            href={newPath}
            className={`text-[10px] tracking-widest px-2 py-1 rounded transition-colors cursor-pointer ${
              locale === currentLocale
                ? 'text-gold border border-gold/40'
                : 'text-cream/50 hover:text-gold'
            }`}
          >
            {labels[locale]}
          </a>
        )
      })}
    </div>
  )
}
