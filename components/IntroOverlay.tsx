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

// Pleated navy satin: vertical pleat ridges + valleys, a broad diagonal sheen,
// and a warm gold glance — reads as draped dressmaker's fabric.
const CLOTH_BG = [
  'linear-gradient(108deg, transparent 32%, rgba(255,255,255,0.05) 45%, transparent 57%)',
  'linear-gradient(300deg, rgba(201,168,76,0.07), transparent 52%)',
  'repeating-linear-gradient(90deg, rgba(255,255,255,0) 0px, rgba(255,255,255,0.06) 16px, rgba(255,255,255,0) 34px, rgba(0,0,0,0.22) 52px, rgba(255,255,255,0) 72px)',
  '#1a1f3a',
].join(', ')

// Soft, slightly angled edge so the cloth reads as fabric being drawn, not a hard wipe.
const CLOTH_MASK = 'linear-gradient(99deg, transparent 0%, transparent 3%, #000 12%)'

export default function IntroOverlay() {
  // Server + first client render show the cloth (so the page never flashes
  // before the intro); the effect decides whether to actually play it.
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Debug: ?introtest holds the intro on screen (for tuning); never unmounts.
    if (new URLSearchParams(window.location.search).has('introtest')) return
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
      {/* Navy pleated-satin cloth — drawn off-screen to reveal the site beneath.
          drop-shadow casts a soft shadow onto the page so the cloth reads as a
          lifted physical layer. */}
      <div
        className="absolute top-0 left-0 h-full"
        style={{
          width: '132vw',
          transform: 'translateX(-16vw)',
          background: CLOTH_BG,
          WebkitMaskImage: CLOTH_MASK,
          maskImage: CLOTH_MASK,
          filter: 'drop-shadow(-18px 0 26px rgba(0,0,0,0.5))',
          animation: `intro-cloth ${FLIGHT}ms ${ease} forwards`,
          transformOrigin: 'top right',
          willChange: 'transform',
        }}
      >
        {/* lit fold catching the light right at the pull edge */}
        <div
          className="absolute inset-y-0"
          style={{
            left: '3%',
            width: '13%',
            background: 'linear-gradient(95deg, transparent, rgba(255,255,255,0.14) 55%, rgba(245,226,161,0.16) 72%, transparent)',
          }}
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
