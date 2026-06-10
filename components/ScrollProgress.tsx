'use client'

import { useEffect, useState } from 'react'

/**
 * Thin gold bar fixed at the very top of the viewport that fills
 * as the user scrolls down the page. A subtle, premium "alive" cue.
 */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let ticking = false

    function update() {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setProgress(pct)
      ticking = false
    }

    function onScroll() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full origin-left transition-transform duration-150 ease-out"
        style={{
          transform: `scaleX(${progress / 100})`,
          background: 'linear-gradient(90deg, #b8860b, #c9a84c, #e8c97a, #f5e2a1)',
          boxShadow: '0 0 12px rgba(201,168,76,0.6)',
        }}
      />
    </div>
  )
}
