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
            <svg
              className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 flex-shrink-0"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="navBirdGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e8d5b7" />
                  <stop offset="100%" stopColor="#c9a84c" />
                </linearGradient>
              </defs>
              {/* Left wing - long elegant curve */}
              <path d="M 16 16 Q 8 12 4 14 Q 2 16 5 20 Q 12 18 16 18" fill="url(#navBirdGradient)" opacity="0.9" />
              {/* Right wing - long elegant curve */}
              <path d="M 16 16 Q 24 12 28 14 Q 30 16 27 20 Q 20 18 16 18" fill="url(#navBirdGradient)" opacity="0.9" />
              {/* Body - small compact center */}
              <ellipse cx="16" cy="17" rx="3" ry="4" fill="url(#navBirdGradient)" />
              {/* Head - pointed beak */}
              <path d="M 16 14 L 19 12 L 17 15 Z" fill="url(#navBirdGradient)" />
            </svg>

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

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed top-16 left-0 right-0 z-40 md:hidden bg-navy-deep/98 border-b border-gold/50 backdrop-blur-md shadow-lg max-h-[calc(100vh-64px)] overflow-y-auto">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-0.5">
            {links.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded text-sm font-medium transition-colors ${
                    active
                      ? 'bg-gold/30 text-gold font-bold'
                      : 'text-cream hover:text-gold hover:bg-gold/15'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <div className="px-4 py-3 border-t border-gold/30 mt-1">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
