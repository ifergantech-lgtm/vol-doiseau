'use client'

import { useEffect, useRef, useState } from 'react'
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
  const bgRef = useRef<HTMLDivElement>(null)
  const [currentIdx, setCurrentIdx] = useState(0)

  // Scroll parallax — bg moves at 25% of scroll speed
  useEffect(() => {
    const bg = bgRef.current
    if (!bg) return

    let ticking = false

    function onScroll() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        if (bg) bg.style.transform = `translateY(${window.scrollY * 0.25}px)`
        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (carouselImages.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIdx(i => (i + 1) % carouselImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [carouselImages.length])

  const words = heroTitle.split(' ')
  const lastWord = words[words.length - 1]
  const firstWords = words.slice(0, -1).join(' ')

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-navy">

      {/* ── Parallax background ──────────────────────────────── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Extra height top+bottom so parallax movement never shows a gap */}
        <div
          ref={bgRef}
          style={{
            position: 'absolute',
            top: '-30%',
            left: 0,
            right: 0,
            bottom: '-30%',
            willChange: 'transform',
          }}
        >
          {carouselImages.length > 0 ? (
            carouselImages.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt=""
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover object-top"
                style={{
                  opacity: i === currentIdx ? 1 : 0,
                  transition: 'opacity 1400ms cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: `kenburns ${8 + i * 1.3}s ease-in-out infinite alternate`,
                  transformOrigin: 'center center',
                }}
              />
            ))
          ) : (
            <Image
              src="/shop/hero-storefront.jpg"
              alt="Vol D'Oiseau — King George 6, Tel Aviv"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          )}
        </div>
        {/* Gradient sits outside the parallax layer so it never moves */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy/92 via-navy/80 to-navy/55 md:from-navy/95 md:via-navy/85 md:to-navy/40" />
      </div>

      {/* ── Aurora orbs ──────────────────────────────────────── */}
      <div
        className="absolute z-0 pointer-events-none rounded-full animate-aurora"
        style={{
          top: '8%',
          right: '16%',
          width: 'clamp(260px, 38vw, 540px)',
          height: 'clamp(260px, 38vw, 540px)',
          background: 'radial-gradient(circle, rgba(201,168,76,0.22) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute z-0 pointer-events-none rounded-full animate-aurora"
        style={{
          bottom: '15%',
          right: '4%',
          width: 'clamp(160px, 22vw, 340px)',
          height: 'clamp(160px, 22vw, 340px)',
          background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)',
          filter: 'blur(55px)',
          animationDelay: '-9s',
        }}
      />

      {/* ── Floating particles ───────────────────────────────── */}
      <FloatingParticles />

      {/* ── Hero content ─────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-24 md:py-32 pt-20 sm:pt-24 md:pt-20">
        <div className="max-w-2xl">

          {/* Tag + gold line */}
          <div className="mb-5 sm:mb-6 md:mb-8 space-y-2 sm:space-y-3">
            <p
              className="hero-enter text-[9px] sm:text-xs tracking-[0.4em] uppercase text-gold/60"
              style={{ animationDelay: '150ms' }}
            >
              Vol D&apos;Oiseau — Paris
            </p>
            <div
              className="hero-enter h-px bg-gradient-to-r from-gold to-transparent"
              style={{ animationDelay: '300ms', width: '44px' }}
            />
          </div>

          {/* Main heading */}
          <div
            className="hero-enter mb-5 sm:mb-6"
            style={{ animationDelay: '480ms' }}
          >
            <h1 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[0.08em] leading-[1.3] sm:leading-[1.2] md:leading-[1.1] text-cream">
              <span>{firstWords}</span>
              <br />
              <span className="text-gold italic">{lastWord}</span>
            </h1>
          </div>

          {/* Subtitle */}
          <p
            className="hero-enter text-cream/75 text-xs sm:text-sm md:text-base leading-relaxed font-light mb-8 sm:mb-10"
            style={{ animationDelay: '680ms' }}
          >
            {heroSubtitle}
          </p>

          {/* CTAs */}
          <div
            className="hero-enter flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4"
            style={{ animationDelay: '880ms' }}
          >
            <MagneticButton
              href={`/${locale}/collection`}
              className="btn-gold px-6 sm:px-8 py-3 md:py-4 text-[10px] sm:text-xs tracking-widest uppercase font-medium text-navy-deep transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.4)] gold-gradient-bg h-11 sm:h-auto md:min-h-[44px] flex items-center justify-center flex-1 sm:flex-none rounded-sm"
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
      </div>

      {/* ── Carousel dots (only if multiple images) ──────────── */}
      {carouselImages.length > 1 && (
        <div className="absolute bottom-16 sm:bottom-20 right-4 sm:right-8 flex flex-col gap-1.5 z-20">
          {carouselImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIdx(i)}
              aria-label={`Show dress ${i + 1}`}
              className="w-px transition-all duration-500"
              style={{
                height: i === currentIdx ? '20px' : '10px',
                background: i === currentIdx ? 'rgba(201,168,76,0.8)' : 'rgba(201,168,76,0.3)',
              }}
            />
          ))}
        </div>
      )}

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
