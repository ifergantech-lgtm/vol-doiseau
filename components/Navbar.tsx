'use client'

import { useTranslations } from 'next-intl'
import { useParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar() {
  const t = useTranslations('nav')
  const params = useParams()
  const locale = (params?.locale as string) || 'he'
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

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

  // Close menu when pathname changes
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <>
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
            {/* Bird Logo - Elegant silhouette in flight */}
            <div className="relative w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 flex-shrink-0">
              <Image
                src="/logo bird final.png"
                alt="Vol D'oiseau logo"
                fill
                className="object-contain"
                priority
              />
            </div>

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
                  className={`group relative text-[10px] lg:text-xs tracking-widest uppercase transition-colors hover:text-gold py-2 px-1 ${
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

          {/* Mobile: Hamburger menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2 text-gold hover:text-cream transition-colors"
            aria-label="Toggle menu"
          >
            <span className={`h-0.5 w-6 bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`h-0.5 w-6 bg-current transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 w-6 bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>

          {/* Language switcher */}
          <div className="hidden md:flex items-center gap-3 sm:gap-4">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Mobile sidebar menu - slides in from left */}
      {menuOpen && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 z-30 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed top-0 left-0 h-screen w-64 z-40 bg-navy-deep border-r border-gold/30 shadow-[4px_0_20px_rgba(0,0,0,0.4)] transform transition-transform duration-300 ease-out translate-x-0 overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-6 right-6 text-gold hover:text-cream transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation */}
            <nav className="pt-20 px-6 flex flex-col gap-2">
              {links.map((link) => {
                const active = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-4 rounded text-lg font-medium tracking-wide transition-all ${
                      active
                        ? 'bg-gold/20 text-gold border-l-4 border-gold'
                        : 'text-cream hover:text-gold hover:bg-gold/10'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            {/* Language Switcher at bottom */}
            <div className="absolute bottom-6 left-0 right-0 px-6 border-t border-gold/20 pt-6">
              <LanguageSwitcher />
            </div>
          </div>
        </>
      )}
    </>
  )
}
