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
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const links = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/collection`, label: t('collection') },
    { href: `/${locale}/services`, label: t('services') },
    { href: `/${locale}/classes`, label: t('classes') },
    { href: `/${locale}/contact`, label: t('contact') },
  ]

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on route change
  useEffect(() => { setOpen(false) }, [pathname])

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
          className="flex-shrink-0 flex flex-col items-center leading-none group py-2"
          onClick={() => setOpen(false)}
        >
          <span className="text-sm sm:text-lg md:text-xl font-display tracking-[0.25em] uppercase gold-shimmer">
            Vol D&apos;Oiseau
          </span>
          <span className="text-[7px] sm:text-[8px] tracking-[0.4em] uppercase text-gold/70 mt-0.5 group-hover:text-gold transition-colors">
            Paris
          </span>
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

        <div className="flex items-center gap-3 sm:gap-4">
          <LanguageSwitcher />

          {/* Mobile hamburger — animated morph to X */}
          <button
            className="md:hidden relative w-12 h-12 flex items-center justify-center text-cream/80 hover:text-gold transition-colors -mr-1.5"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span
              className={`absolute block h-0.5 w-6 bg-current transition-all duration-300 ${
                open ? 'rotate-45' : '-translate-y-2'
              }`}
            />
            <span
              className={`absolute block h-0.5 w-6 bg-current transition-all duration-300 ${
                open ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute block h-0.5 w-6 bg-current transition-all duration-300 ${
                open ? '-rotate-45' : 'translate-y-2'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile full-height drop-down menu */}
      <nav
        className={`md:hidden fixed inset-x-0 top-20 bottom-0 bg-navy-deep/98 backdrop-blur-xl border-t border-gold/20 transition-all duration-500 ${
          open
            ? 'opacity-100 visible translate-y-0'
            : 'opacity-0 invisible -translate-y-2 pointer-events-none'
        }`}
        aria-hidden={!open}
      >
        <div className="h-full overflow-y-auto px-5 sm:px-6 py-8 sm:py-10 flex flex-col gap-0.5">
          {links.map((link, idx) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block py-3.5 sm:py-4 text-base sm:text-lg font-display tracking-[0.15em] uppercase border-b border-gold/10 transition-all duration-300 ${
                  active ? 'text-gold' : 'text-cream/80 hover:text-gold'
                } ${open ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}
                style={{ transitionDelay: open ? `${100 + idx * 60}ms` : '0ms' }}
              >
                <span className="inline-flex items-center gap-3">
                  <span className="text-[9px] text-gold/40 font-body">0{idx + 1}</span>
                  {link.label}
                </span>
              </Link>
            )
          })}

          {/* Contact strip at the bottom of the menu */}
          <div
            className={`mt-auto pt-8 sm:pt-10 transition-all duration-500 ${
              open ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: open ? '500ms' : '0ms' }}
          >
            <p className="text-[9px] tracking-[0.4em] uppercase text-gold/50 mb-2 sm:mb-3">Vol D&apos;Oiseau</p>
            <p className="text-xs sm:text-sm text-cream/60 mb-1">King George 6, Tel Aviv</p>
            <a href="tel:0502290718" className="text-xs sm:text-sm text-cream/60 hover:text-gold transition-colors block">
              050-229-0718
            </a>
          </div>
        </div>
      </nav>
    </header>
  )
}
