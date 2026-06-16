'use client'

import { useEffect, useState } from 'react'

/**
 * One-time opening animation: a navy veil covers the site, then the gold bird
 * flies across and the veil is wiped away in its wake — uncovering the site as
 * it flies. Shows once per browser session, is click-to-skip, and is disabled
 * for reduced-motion users.
 */
const FLIGHT = 2600 // ms — matches the intro-bird / intro-reveal animations
const DURATION = 2800 // ms — when the overlay unmounts

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

  const ease = 'cubic-bezier(0.4, 0, 0.2, 1)'

  return (
    <div
      onClick={() => setVisible(false)}
      aria-hidden="true"
      className="fixed inset-0 z-[100] overflow-hidden cursor-pointer"
    >
      {/* Navy veil — wiped left→right in sync with the bird, revealing the site beneath */}
      <div
        className="absolute inset-0 bg-navy"
        style={{ animation: `intro-reveal ${FLIGHT}ms ${ease} forwards` }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(circle at 50% 42%, rgba(201,168,76,0.14), transparent 60%)' }}
        />
      </div>

      {/* The bird flies on top of the veil (never clipped), leading the reveal */}
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
