'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import Link from 'next/link'

interface MagneticButtonProps {
  children: ReactNode
  href: string
  className?: string
  /** Max pixel pull. Default 6. Keep small for elegance. */
  strength?: number
}

/**
 * Wraps a Link with a subtle cursor-magnet effect.
 * Disabled on touch devices (no point pulling toward an absent cursor).
 */
export default function MagneticButton({
  children,
  href,
  className = '',
  strength = 6,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Skip on touch / coarse pointer devices
    if (typeof window === 'undefined' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return
    }

    let rafId = 0

    function onMove(e: MouseEvent) {
      if (!node) return
      const rect = node.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) / (rect.width / 2)
      const dy = (e.clientY - cy) / (rect.height / 2)
      // Clamp to [-1, 1] then scale to strength
      const x = Math.max(-1, Math.min(1, dx)) * strength
      const y = Math.max(-1, Math.min(1, dy)) * strength
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        if (node) node.style.transform = `translate(${x}px, ${y}px)`
      })
    }

    function onLeave() {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        if (node) node.style.transform = 'translate(0, 0)'
      })
    }

    node.addEventListener('mousemove', onMove)
    node.addEventListener('mouseleave', onLeave)

    return () => {
      node.removeEventListener('mousemove', onMove)
      node.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(rafId)
    }
  }, [strength])

  return (
    <Link
      ref={ref}
      href={href}
      className={`inline-block transition-transform duration-300 ease-out will-change-transform ${className}`}
    >
      {children}
    </Link>
  )
}
