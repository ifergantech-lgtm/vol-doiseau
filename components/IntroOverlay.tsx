'use client'

import { useEffect, useState } from 'react'

/**
 * One-time opening animation: a piece of navy satin "cloth" covers the site,
 * then the gold bird flies across and draws the cloth away — uncovering the
 * site, a nod to Élisheva the seamstress. Shows once per browser session,
 * is click-to-skip, and is disabled for reduced-motion users.
 */
const FLIGHT = 2700 // ms — matches intro-bird / intro-cloth
const DURATION = 2900 // ms — when the overlay unmounts

// Navy satin: broad fold sheens + a fine weave + a warm gold glance.
const CLOTH_BG = [
  'linear-gradient(115deg, transparent 28%, rgba(255,255,255,0.06) 42%, transparent 52%)',
  'linear-gradient(115deg, transparent 58%, rgba(255,255,255,0.045) 69%, transparent 80%)',
  'repeating-linear-gradient(102deg, rgba(255,255,255,0.022) 0 2px, transparent 2px 11px)',
  'linear-gradient(300deg, rgba(201,168,76,0.06), transparent 55%)',
  '#1a1f3a',
].join(', ')

// Soft, slightly angled edge so the cloth reads as fabric being drawn, not a hard wipe.
const CLOTH_MASK = 'linear-gradient(100deg, transparent 0%, transparent 4%, #000 13%)'

export default function IntroOverlay() {
  // Server + first client render show the cloth (so the page never flashes
  // before the intro); the effect decides whether to actually play it.
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const seen = sessionStorage.getItem('voldoiseau-intro')
    if (reduce || seen) {
      setVisible(false)
      return
    }
    sessionStorage.setItem('voldoiseau-intro', '1')
    const timer = setTimeout(() => setVisible(false), DURATION)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  const ease = 'cubic-bezier(0.55, 0, 0.45, 1)'

  return (
    <div
      onClick={() => setVisible(false)}
      aria-hidden="true"
      className="fixed inset-0 z-[100] overflow-hidden cursor-pointer"
    >
      {/* Navy satin cloth — drawn off-screen to reveal the site beneath */}
      <div
        className="absolute top-0 left-0 h-full"
        style={{
          width: '132vw',
          transform: 'translateX(-16vw)',
          background: CLOTH_BG,
          WebkitMaskImage: CLOTH_MASK,
          maskImage: CLOTH_MASK,
          animation: `intro-cloth ${FLIGHT}ms ${ease} forwards`,
          transformOrigin: 'top right',
          willChange: 'transform',
        }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(circle at 58% 40%, rgba(201,168,76,0.12), transparent 60%)' }}
        />
      </div>

      {/* The bird leads, appearing to draw the cloth away */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-bird.svg"
        alt=""
        className="absolute top-0 left-0 w-[64px] sm:w-[84px] md:w-[96px] h-auto"
        style={{
          animation: `intro-bird ${FLIGHT}ms ${ease} forwards`,
          filter: 'drop-shadow(0 0 24px rgba(201,168,76,0.55))',
          willChange: 'transform, opacity',
        }}
      />
    </div>
  )
}
