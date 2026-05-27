'use client'

import { useParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import LanguageSwitcher from './LanguageSwitcher'

export default function BottomNav() {
  const t = useTranslations('nav')
  const params = useParams()
  const locale = (params?.locale as string) || 'he'
  const pathname = usePathname()

  const links = [
    { href: `/${locale}`, label: t('home'), icon: '◆' },
    { href: `/${locale}/collection`, label: t('collection'), icon: '◇' },
    { href: `/${locale}/services`, label: t('services'), icon: '◈' },
    { href: `/${locale}/classes`, label: t('classes'), icon: '◇' },
    { href: `/${locale}/contact`, label: t('contact'), icon: '✉' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-navy-deep/98 border-t border-gold/30 backdrop-blur-lg z-40">
      <div className="flex items-center justify-between px-2 sm:px-3 py-2 sm:py-3 overflow-x-auto">
        {/* Navigation Links */}
        <div className="flex items-center gap-1 sm:gap-2 flex-1 overflow-x-auto">
          {links.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center whitespace-nowrap px-2 sm:px-3 py-1.5 text-[8px] sm:text-[9px] tracking-wider uppercase transition-colors rounded-sm ${
                  active ? 'text-gold bg-gold/10' : 'text-cream/60 hover:text-gold'
                }`}
              >
                <span className="text-xs sm:text-sm mb-0.5">{link.icon}</span>
                <span className="hidden xs:inline">{link.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Language Switcher */}
        <div className="flex-shrink-0 ml-2 sm:ml-3 border-l border-gold/20 pl-2 sm:pl-3">
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  )
}
