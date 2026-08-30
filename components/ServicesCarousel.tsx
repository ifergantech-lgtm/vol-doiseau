'use client'

import { useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export interface ServiceItem {
  href: string
  num: string
  title: string
  desc: string
  img: string
}

interface Props {
  items: ServiceItem[]
  discoverLabel: string
}

export default function ServicesCarousel({ items, discoverLabel }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const onScroll = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[data-card]')
    if (!card) return
    const gap = 16
    const idx = Math.round(el.scrollLeft / (card.offsetWidth + gap))
    setActive(Math.max(0, Math.min(items.length - 1, idx)))
  }, [items.length])

  const scrollTo = useCallback((idx: number) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[data-card]')
    if (!card) return
    const gap = 16
    el.scrollTo({ left: idx * (card.offsetWidth + gap), behavior: 'smooth' })
  }, [])

  const nudge = useCallback((dir: 1 | -1) => scrollTo(Math.max(0, Math.min(items.length - 1, active + dir))), [active, items.length, scrollTo])

  return (
    <div className="relative">
      {/* Track */}
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="snap-x flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        {items.map((s) => (
          <Link
            key={s.href + s.num}
            href={s.href}
            data-card
            className="snap-item group relative flex-shrink-0 w-[78%] xs:w-[70%] sm:w-[46%] lg:w-[31%] xl:w-[calc(25%-12px)] h-[400px] sm:h-[440px] overflow-hidden rounded-lg border border-gold/15 hover:border-gold/50 transition-colors duration-500"
          >
            {/* Image */}
            <Image
              src={s.img}
              alt={s.title}
              fill
              sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 25vw"
              className="object-cover object-center transition-transform duration-[1400ms] ease-out group-hover:scale-[1.08]"
            />
            {/* Legibility + brand tint */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/55 to-navy-deep/10" />
            <div className="absolute inset-0 bg-gradient-to-tr from-gold/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="card-shine absolute inset-0 pointer-events-none" aria-hidden="true" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-7">
              <span className="text-[10px] tracking-[0.4em] uppercase text-gold/70 mb-2">{s.num}</span>
              <h3 className="font-display text-2xl sm:text-[1.7rem] tracking-[0.04em] text-cream leading-tight mb-2 group-hover:text-gold-light transition-colors">
                {s.title}
              </h3>
              <p className="text-[12.5px] sm:text-sm text-cream/65 leading-relaxed mb-4 max-w-[92%]">
                {s.desc}
              </p>
              <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-gold/80 group-hover:text-gold transition-colors">
                {discoverLabel}
                <span className="inline-block transition-transform duration-500 group-hover:translate-x-1.5">→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-between">
        {/* Dots */}
        <div className="flex items-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === active ? 'w-7 bg-gold' : 'w-1.5 bg-gold/30 hover:bg-gold/60'
              }`}
            />
          ))}
        </div>

        {/* Arrows */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => nudge(-1)}
            disabled={active === 0}
            aria-label="Previous"
            className="w-10 h-10 rounded-full border border-gold/30 text-gold flex items-center justify-center transition-all hover:border-gold hover:bg-gold/10 disabled:opacity-25 disabled:pointer-events-none"
          >
            <span className="rtl:rotate-180">←</span>
          </button>
          <button
            onClick={() => nudge(1)}
            disabled={active === items.length - 1}
            aria-label="Next"
            className="w-10 h-10 rounded-full border border-gold/30 text-gold flex items-center justify-center transition-all hover:border-gold hover:bg-gold/10 disabled:opacity-25 disabled:pointer-events-none"
          >
            <span className="rtl:rotate-180">→</span>
          </button>
        </div>
      </div>
    </div>
  )
}
