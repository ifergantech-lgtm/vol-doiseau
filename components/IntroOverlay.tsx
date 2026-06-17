'use client'

import { useEffect, useState } from 'react'

/**
 * One-time opening animation: a navy pleated-satin cloth covers the site, then
 * (as the bird lifts away) it is released and falls under gravity — fold by
 * fold, slightly out of sync so a ripple runs through it — uncovering the site.
 * A nod to Élisheva the seamstress. Once per browser session, click-to-skip,
 * disabled for reduced-motion users.
 */
const FOLDS = 9
const FALL = 2200 // ms — a single fold's drop
const STAGGER = 70 // ms between folds (the ripple)
const DURATION = FALL + STAGGER * FOLDS + 250 // when the overlay unmounts

// One drape fold: dark valleys at the sides, a lit satin ridge down the middle,
// over deep navy with a faint warm glance. Adjacent folds read as pleated cloth.
const FOLD_BG = [
  'linear-gradient(90deg, rgba(0,0,0,0.34) 0%, rgba(255,255,255,0.04) 38%, rgba(255,255,255,0.08) 52%, rgba(0,0,0,0.10) 70%, rgba(0,0,0,0.36) 100%)',
  'linear-gradient(180deg, rgba(201,168,76,0.06), transparent 42%)',
  '#1a1f3a',
].join(', ')

// Soft top edge so the released (reveal) edge looks draped, not cut.
const TOP_FADE = 'linear-gradient(180deg, transparent 0, #000 5%)'

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

  const slot = 100 / FOLDS

  return (
    <div
      onClick={() => setVisible(false)}
      aria-hidden="true"
      className="fixed inset-0 z-[100] overflow-hidden cursor-pointer"
    >
      {Array.from({ length: FOLDS }).map((_, i) => {
        // Ripple from the centre outward so the cloth sags in the middle first.
        const fromCentre = Math.abs(i - (FOLDS - 1) / 2)
        const delay = (FOLDS / 2 - fromCentre) * STAGGER
        const sway = (i % 2 ? 1 : -1) * (1.2 + fromCentre * 0.5)
        return (
          <div
            key={i}
            className="absolute"
            style={{
              top: '-12vh',
              height: '128vh',
              left: `${i * slot}vw`,
              width: `calc(${slot}vw + 1.5px)`,
              background: FOLD_BG,
              WebkitMaskImage: TOP_FADE,
              maskImage: TOP_FADE,
              filter: 'drop-shadow(0 14px 22px rgba(0,0,0,0.4))',
              transformOrigin: 'top center',
              '--sway': `${sway}deg`,
              animation: `intro-drop ${FALL}ms cubic-bezier(0.5, 0, 0.9, 0.42) ${delay}ms forwards`,
              willChange: 'transform',
            } as React.CSSProperties}
          />
        )
      })}

      {/* The bird rises, lifting the cloth free */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-bird.svg"
        alt=""
        className="absolute top-0 left-0 w-[64px] sm:w-[84px] md:w-[96px] h-auto"
        style={{
          animation: `intro-bird ${FALL}ms cubic-bezier(0.3, 0, 0.4, 1) forwards`,
          filter: 'drop-shadow(0 0 24px rgba(201,168,76,0.55))',
          willChange: 'transform, opacity',
        }}
      />
    </div>
  )
}
