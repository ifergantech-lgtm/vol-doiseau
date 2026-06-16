'use client'

import { useEffect, useState } from 'react'

/**
 * One-time opening animation: the gold bird flies elegantly across a navy
 * veil, then the veil lifts to reveal the site. Shows once per browser
 * session, is click-to-skip, and is disabled for reduced-motion users.
 */
const DURATION = 2900 // ms — keep in sync with the intro-veil animation

export default function IntroOverlay() {
  // Server + first client render show the veil (so the page never flashes
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

  return (
    <div
      onClick={() => setVisible(false)}
      aria-hidden="true"
      className="fixed inset-0 z-[100] bg-navy overflow-hidden flex items-center justify-center cursor-pointer"
      style={{ animation: `intro-veil ${DURATION}ms ease-in forwards` }}
    >
      {/* soft gold glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 42%, rgba(201,168,76,0.14), transparent 60%)' }}
      />

      {/* wordmark */}
      <p
        className="font-display tracking-[0.4em] uppercase text-lg sm:text-2xl md:text-3xl text-cream/90"
        style={{ animation: `intro-word ${DURATION}ms ease-in-out forwards` }}
      >
        Vol D&apos;Oiseau
      </p>

      {/* the flying bird */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-bird.svg"
        alt=""
        className="absolute top-0 left-0 w-[64px] sm:w-[84px] md:w-[96px] h-auto pointer-events-none"
        style={{
          animation: 'intro-bird 2600ms cubic-bezier(0.4, 0, 0.2, 1) forwards',
          filter: 'drop-shadow(0 0 22px rgba(201,168,76,0.45))',
          willChange: 'transform, opacity',
        }}
      />
    </div>
  )
}
