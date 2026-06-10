'use client'

import { useEffect, useRef, useState, type ReactNode, type ElementType } from 'react'

interface RevealProps {
  children: ReactNode
  className?: string
  /** When true, children get `reveal-stagger` so child elements animate in sequence */
  stagger?: boolean
  /** Animation style. 'up' (default) fades up; 'zoom' fades + scales in. */
  variant?: 'up' | 'zoom'
  /** Wrapper element. Defaults to div. */
  as?: ElementType
  /** Distance from viewport edge to start the animation (px). Default: 80. */
  rootMargin?: string
  /** How much of the element should be visible (0–1). Default: 0.05. */
  threshold?: number
  /** Disable animation entirely (e.g., for above-the-fold content) */
  disabled?: boolean
}

/**
 * Wraps children with an IntersectionObserver-triggered fade-in-up animation.
 * Adds `reveal` (or `reveal-stagger`) class to the wrapper; toggles `is-visible`
 * once the element enters the viewport. CSS lives in globals.css.
 */
export default function Reveal({
  children,
  className = '',
  stagger = false,
  variant = 'up',
  as: Tag = 'div',
  rootMargin = '0px 0px -80px 0px',
  threshold = 0.05,
  disabled = false,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(disabled)

  useEffect(() => {
    if (disabled) return
    const node = ref.current
    if (!node) return

    // Already in view on mount (above-the-fold)? Reveal immediately.
    const rect = node.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin, threshold }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [rootMargin, threshold, disabled])

  const baseClass = stagger ? 'reveal-stagger' : variant === 'zoom' ? 'reveal-zoom' : 'reveal'
  const visibleClass = visible ? ' is-visible' : ''
  const merged = `${baseClass}${visibleClass}${className ? ` ${className}` : ''}`

  return (
    <Tag ref={ref as never} className={merged}>
      {children}
    </Tag>
  )
}
