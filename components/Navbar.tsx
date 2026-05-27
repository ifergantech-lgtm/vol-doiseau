'use client'

import { useTranslations } from 'next-intl'
import { useParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar() {
  const t = useTranslations('nav')
  const params = useParams()
  const locale = (params?.locale as string) || 'he'
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  const links = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/collection`, label: t('collection') },
    { href: `/${locale}/services`, label: t('services') },
    { href: `/${locale}/classes`, label: t('classes') },
    { href: `/${locale}/contact`, label: t('contact') },
  ]


  // Subtle shrink on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-navy-deep/95 border-b border-gold/30 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
          : 'bg-navy/80 border-b border-gold/10'
      } backdrop-blur-md`}
    >
      <div
        className={`max-w-7xl mx-auto px-5 sm:px-6 flex items-center justify-between gap-4 transition-all duration-500 ${
          scrolled ? 'h-16' : 'h-20'
        }`}
      >
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="flex-shrink-0 flex items-center gap-2 sm:gap-3 leading-none group py-2"
        >
          {/* Bird Logo */}
          <img
            src="/bird-logo.svg"
            alt="Vol D'Oiseau bird logo"
            className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 flex-shrink-0"
          />

          {/* Text */}
          <div className="flex flex-col leading-none">
            <span className="text-sm sm:text-lg md:text-xl font-display tracking-[0.25em] uppercase gold-shimmer">
              Vol D&apos;Oiseau
            </span>
            <span className="text-[7px] sm:text-[8px] tracking-[0.4em] uppercase text-gold/70 mt-0.5 group-hover:text-gold transition-colors">
              Paris
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {links.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-[10px] lg:text-xs tracking-widest uppercase transition-colors hover:text-gold py-2 px-1 ${
                  active ? 'text-gold' : 'text-cream/70'
                }`}
              >
                {link.label}
                <span
                  className={`absolute left-0 right-0 -bottom-0.5 mx-auto h-px transition-all duration-500 ${
                    active ? 'w-full bg-gold/60' : 'w-0 bg-gold/40 group-hover:w-full'
                  }`}
                />
              </Link>
            )
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3 sm:gap-4">
          <LanguageSwitcher />
        </div>
      </div>

    </header>
  )
}
