'use client'

import { useParams, usePathname } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { useState, useRef, useEffect } from 'react'

const labels: Record<string, string> = {
  he: 'עברית', fr: 'Français', en: 'English',
  es: 'Español', it: 'Italiano', ru: 'Русский',
  ar: 'العربية', pt: 'Português'
}

export default function LanguageSwitcher() {
  const params = useParams()
  const pathname = usePathname()
  const currentLocale = (params?.locale as string) || routing.defaultLocale
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Remove the current locale prefix from pathname, then prepend the new one
  // In next-intl with App Router, pathname includes the locale at the beginning
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/$1')

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Globe Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gold hover:text-cream transition-colors flex items-center justify-center"
        aria-label="Change language"
        title="Language"
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20H7m6-4h.01M3 13h2m10 0h2M3 21h18"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 z-50 bg-navy-deep border border-gold/30 rounded shadow-lg overflow-hidden">
          <div className="py-2">
            {routing.locales.map((locale) => {
              const newPath = `/${locale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`
              const isActive = locale === currentLocale
              return (
                <a
                  key={locale}
                  href={newPath}
                  className={`block px-4 py-2 text-sm tracking-wide transition-colors ${
                    isActive
                      ? 'bg-gold/20 text-gold border-l-4 border-gold'
                      : 'text-cream hover:bg-gold/10 hover:text-gold'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {labels[locale]}
                </a>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
