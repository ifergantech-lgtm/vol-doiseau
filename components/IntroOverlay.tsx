'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

// R3F must never render on the server (it touches WebGL/window).
const ClothCanvas = dynamic(() => import('./ClothCanvas'), { ssr: false })

/**
 * One-time opening: a navy-satin cloth (a real WebGL Verlet simulation) hangs
 * over the site, then is released and falls under gravity — rippling and
 * folding — to uncover the page beneath, as the gold bird lifts away. A nod to
 * Élisheva the seamstress. Once per session, click-to-skip, reduced-motion safe.
 */
export default function IntroOverlay() {
  const [active, setActive] = useState(true) // overlay mounted?
  const [covered, setCovered] = useState(true) // opaque navy base (anti-flash) until the cloth releases
  const [leaving, setLeaving] = useState(false) // fade-out
  const [freezeAt, setFreezeAt] = useState<number | undefined>(undefined) // ?introfreeze=<s> debug
  const testRef = useRef(false) // ?introtest / ?introfreeze: hold the intro open for tuning

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const freeze = params.get('introfreeze')
    if (params.has('introtest') || freeze != null) {
      testRef.current = true
      setCovered(false) // reveal the page behind so the cloth fall is visible
      if (freeze != null) setFreezeAt(parseFloat(freeze) || 0)
      return
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const seen = sessionStorage.getItem('voldoiseau-intro')
    if (reduce || seen) {
      setActive(false)
      return
    }
    sessionStorage.setItem('voldoiseau-intro', '1')
    // Safety net: if WebGL fails or the canvas never loads, reveal anyway.
    const safety = setTimeout(() => finish(), 5200)
    return () => clearTimeout(safety)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function finish() {
    if (testRef.current) return // tuning mode: keep it on screen
    setCovered(false)
    setLeaving(true)
    setTimeout(() => setActive(false), 650)
  }

  if (!active) return null

  return (
    <div
      onClick={finish}
      aria-hidden="true"
      className="fixed inset-0 z-[100] overflow-hidden cursor-pointer"
      style={{ opacity: leaving ? 0 : 1, transition: 'opacity 650ms ease' }}
    >
      {/* Opaque navy base — hides the page during canvas load and while the
          cloth hangs; lifted the instant the cloth is released. */}
      {covered && <div className="absolute inset-0 bg-navy" />}

      {/* The falling-cloth simulation (transparent canvas) */}
      <div className="absolute inset-0">
        <ClothCanvas onReveal={() => setCovered(false)} onDone={finish} freezeAt={freezeAt} />
      </div>

      {/* The bird lifts away as the cloth is drawn up and falls */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-bird.svg"
        alt=""
        className="absolute top-0 left-0 w-[64px] sm:w-[84px] md:w-[96px] h-auto"
        style={{
          animation: 'intro-bird 2600ms cubic-bezier(0.3, 0, 0.4, 1) forwards',
          filter: 'drop-shadow(0 0 24px rgba(201,168,76,0.55))',
          willChange: 'transform, opacity',
        }}
      />
    </div>
  )
}
