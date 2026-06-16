'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import MagneticButton from '@/components/MagneticButton'

// Deterministic positions — no Math.random (avoids hydration mismatch)
const PARTICLES = [
  { top: '76%', left: '11%', size: 2,   duration: '9s',   delay: '0s'   },
  { top: '83%', left: '27%', size: 1.5, duration: '11s',  delay: '2.5s' },
  { top: '79%', left: '44%', size: 1,   duration: '7.5s', delay: '4.2s' },
  { top: '86%', left: '61%', size: 2,   duration: '10s',  delay: '1.8s' },
  { top: '72%', left: '76%', size: 1.5, duration: '8.5s', delay: '3.5s' },
  { top: '80%', left: '89%', size: 1,   duration: '12s',  delay: '0.8s' },
]

function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[1]" aria-hidden="true">
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-gold"
          style={{
            top: p.top,
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: 0,
            animation: `particle-rise ${p.duration} ${p.delay} ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  )
}

interface HeroSectionProps {
  locale: string
  heroTitle: string
  heroSubtitle: string
  ctaCollection: string
  ctaContact: string
  carouselImages?: string[]
}

export default function HeroSection({
  locale,
  heroTitle,
  heroSubtitle,
  ctaCollection,
  ctaContact,
  carouselImages = [],
}: HeroSectionProps) {
  const [currentIdx, setCurrentIdx] = useState(0)

  // Show the dresses standing in a portrait frame (no cropping). Fall back to
  // the storefront photo if there are no dress images yet.
  const heroImages = carouselImages.length > 0 ? carouselImages : ['/shop/hero-storefront.jpg']

  // Auto-advance carousel every 2.4 seconds
  useEffect(() => {
    if (heroImages.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIdx(i => (i + 1) % heroImages.length)
    }, 2400)
    return () => clearInterval(timer)
  }, [heroImages.length])

  const words = heroTitle.split(' ')
  const lastWord = words[words.length - 1]
  const firstWords = words.slice(0, -1).join(' ')

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-navy">

      {/* ── Aurora orbs ──────────────────────────────────────── */}
      <div
        className="absolute z-0 pointer-events-none rounded-full animate-aurora"
        style={{
          top: '6%',
          right: '14%',
          width: 'clamp(260px, 38vw, 540px)',
          height: 'clamp(260px, 38vw, 540px)',
          background: 'radial-gradient(circle, rgba(201,168,76,0.20) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute z-0 pointer-events-none rounded-full animate-aurora"
        style={{
          bottom: '12%',
          left: '6%',
          width: 'clamp(160px, 22vw, 340px)',
          height: 'clamp(160px, 22vw, 340px)',
          background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)',
          filter: 'blur(55px)',
          animationDelay: '-9s',
        }}
      />

      {/* ── Floating particles ───────────────────────────────── */}
      <FloatingParticles />

      {/* ── Hero content: text + standing dress ──────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 pt-28 pb-20 sm:py-24 md:py-20 grid md:grid-cols-2 items-center gap-10 sm:gap-12 lg:gap-16">

        {/* Left — text */}
        <div className="max-w-xl">
          {/* Tag + gold line */}
          <div className="mb-5 sm:mb-6 md:mb-8 space-y-2 sm:space-y-3">
            <p className="hero-enter text-[9px] sm:text-xs tracking-[0.4em] uppercase text-gold/60" style={{ animationDelay: '150ms' }}>
              Vol D&apos;Oiseau — Paris
            </p>
            <div className="hero-enter h-px bg-gradient-to-r from-gold to-transparent" style={{ animationDelay: '300ms', width: '44px' }} />
          </div>

          {/* Main heading */}
          <div className="hero-enter mb-5 sm:mb-6" style={{ animationDelay: '480ms' }}>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[0.08em] leading-[1.3] sm:leading-[1.2] md:leading-[1.1] text-cream">
              <span>{firstWords}</span>
              <br />
              <span className="gold-shimmer italic">{lastWord}</span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="hero-enter text-cream/75 text-xs sm:text-sm md:text-base leading-relaxed font-light mb-8 sm:mb-10" style={{ animationDelay: '680ms' }}>
            {heroSubtitle}
          </p>

          {/* CTAs */}
          <div className="hero-enter flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4" style={{ animationDelay: '880ms' }}>
            <MagneticButton
              href={`/${locale}/collection`}
              className="btn-gold breathe-glow px-6 sm:px-8 py-3 md:py-4 text-[10px] sm:text-xs tracking-widest uppercase font-medium text-navy-deep transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.4)] gold-gradient-bg h-11 sm:h-auto md:min-h-[44px] flex items-center justify-center flex-1 sm:flex-none rounded-sm"
            >
              {ctaCollection} →
            </MagneticButton>
            <Link
              href={`/${locale}/contact`}
              className="px-6 sm:px-8 py-3 md:py-4 text-[10px] sm:text-xs tracking-widest uppercase border border-gold/40 text-cream/70 hover:border-gold hover:text-gold transition-all text-center h-11 sm:h-auto md:min-h-[44px] flex items-center justify-center flex-1 sm:flex-none rounded-sm"
            >
              {ctaContact}
            </Link>
          </div>
        </div>

        {/* Right — standing dress in a portrait frame (no crop) */}
        <div className="hero-enter order-first md:order-none" style={{ animationDelay: '400ms' }}>
          <div className="relative mx-auto w-full max-w-[260px] sm:max-w-[330px] md:max-w-[400px] aspect-[3/4] rounded-sm overflow-hidden border border-gold/20 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.8)]">
            {heroImages.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt=""
                fill
                priority={i === 0}
                sizes="(max-width: 768px) 80vw, 400px"
                className="object-cover object-center"
                style={{
                  opacity: i === currentIdx ? 1 : 0,
                  transform: i === currentIdx ? 'translateX(0)' : 'translateX(20%)',
                  transition: 'opacity 380ms ease-out, transform 620ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            ))}
            {/* Soft inner border + bottom fade for depth */}
            <div className="absolute inset-0 ring-1 ring-inset ring-gold/10 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-navy/40 to-transparent pointer-events-none" />
          </div>

          {/* Dots */}
          {heroImages.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-5">
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIdx(i)}
                  aria-label={`Show dress ${i + 1}`}
                  className="h-px transition-all duration-500"
                  style={{
                    width: i === currentIdx ? '24px' : '10px',
                    background: i === currentIdx ? 'rgba(201,168,76,0.85)' : 'rgba(201,168,76,0.3)',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Scroll indicator ─────────────────────────────────── */}
      <div
        className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 sm:gap-2 text-cream/40 z-20"
        style={{ animation: 'fade-in 600ms 1400ms both' }}
      >
        <span className="text-[8px] sm:text-[9px] tracking-[0.4em] uppercase">Scroll</span>
        <div className="w-px h-6 sm:h-8 bg-gradient-to-b from-gold/60 to-transparent animate-scroll-bounce" />
      </div>

    </section>
  )
}
