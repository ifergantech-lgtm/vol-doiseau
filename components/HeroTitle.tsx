'use client'

/**
 * Animated hero title — splits the string into words and animates them in
 * with a stagger (preserves spaces and avoids splitting RTL Hebrew letters
 * individually, which would break the reading order).
 */
interface HeroTitleProps {
  text: string
  className?: string
}

export default function HeroTitle({ text, className = '' }: HeroTitleProps) {
  // Split by space, keep order intact (works for both LTR and RTL languages)
  const words = text.split(' ').filter(Boolean)

  return (
    <h1 className={`letter-stagger ${className}`}>
      {words.map((word, i) => (
        <span
          key={i}
          className="letter inline-block"
          style={{ animationDelay: `${100 + i * 90}ms` }}
        >
          {word}
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </h1>
  )
}
