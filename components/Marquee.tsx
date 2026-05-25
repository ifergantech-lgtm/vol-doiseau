/**
 * Pure-CSS infinite scrolling marquee. Renders the items twice so the loop is
 * seamless when `translateX(-50%)` resets at the end of the keyframe.
 */
interface MarqueeProps {
  items: string[]
  /** Tailwind classes for the strip wrapper */
  className?: string
}

export default function Marquee({ items, className = '' }: MarqueeProps) {
  // Render items twice for seamless loop
  const doubled = [...items, ...items]

  return (
    <div className={`relative overflow-hidden border-y border-gold/10 bg-navy-deep ${className}`}>
      {/* Edge fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 z-10 bg-gradient-to-r from-navy-deep to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 z-10 bg-gradient-to-l from-navy-deep to-transparent" />

      <div className="flex animate-marquee whitespace-nowrap py-5 sm:py-6 w-max">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 sm:gap-10 px-6 sm:px-10 font-display text-xl sm:text-2xl md:text-3xl tracking-[0.3em] uppercase text-gold/70"
          >
            {item}
            <span className="text-gold/30 text-sm">◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}
