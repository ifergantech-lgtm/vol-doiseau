import Image from 'next/image'
import Link from 'next/link'
import { formatPrice, getLocalizedText, type Locale } from '@/lib/utils'

interface Dress {
  id: string
  slug: string
  title: Record<string, string>
  category: string
  availability: string
  price_sale: number | null
  price_rental: number | null
  images: string[]
}

interface DressCardProps {
  dress: Dress
  locale: Locale
  availabilityLabels: { sale: string; rental: string; both: string }
}

export default function DressCard({ dress, locale, availabilityLabels }: DressCardProps) {
  const title = getLocalizedText(dress.title, locale, 'Untitled')
  const primary = dress.images[0] || `https://picsum.photos/seed/${dress.slug}/800/1100`
  const secondary = dress.images[1] // optional alternate angle

  const categoryColor = {
    evening: 'bg-gold/10 text-gold border-gold/30',
    wedding: 'bg-cream/10 text-cream border-cream/30',
  }[dress.category] || 'bg-gold/10 text-gold border-gold/30'

  const availLabel =
    dress.availability === 'sale'
      ? availabilityLabels.sale
      : dress.availability === 'rental'
      ? availabilityLabels.rental
      : availabilityLabels.both

  return (
    <Link href={`/${locale}/collection/${dress.slug}`} className="group block focus:outline-none">
      <article className="relative overflow-hidden rounded-sm bg-navy-deep border border-gold/10 group-hover:border-gold/40 group-focus-visible:border-gold transition-all duration-500 group-hover:shadow-[0_15px_40px_-15px_rgba(201,168,76,0.3)] group-hover:-translate-y-1">
        {/* Image stack — secondary fades in on hover if present */}
        <div className="relative aspect-[3/4] overflow-hidden bg-navy">
          <Image
            src={primary}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-all duration-[1200ms] ease-out group-hover:scale-110 ${
              secondary ? 'group-hover:opacity-0' : ''
            }`}
          />
          {secondary && (
            <Image
              src={secondary}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100 scale-105 group-hover:scale-110"
            />
          )}
          {/* Top dark fade for badge contrast */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-navy-deep/60 to-transparent" />
          {/* Bottom dark fade for title contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/10 to-transparent pointer-events-none" />
          {/* Gold sweep on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-tr from-gold/0 via-gold/5 to-gold/0 pointer-events-none" />
          {/* Diagonal light shine that sweeps across on hover */}
          <div className="card-shine absolute inset-0 pointer-events-none" aria-hidden="true" />
          {/* Availability badge */}
          <span
            className={`absolute top-2 sm:top-3 start-2 sm:start-3 text-[8px] sm:text-[9px] tracking-[0.2em] uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 border rounded-full backdrop-blur-sm ${categoryColor} transition-transform duration-500 group-hover:scale-105`}
          >
            {availLabel}
          </span>
          {/* Quick-view label that fades in on hover (desktop) */}
          <span className="absolute bottom-3 end-3 text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-gold opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 hidden sm:inline-block">
            View →
          </span>
        </div>

        {/* Info */}
        <div className="p-3 sm:p-4 md:p-5">
          <h3 className="font-display text-sm sm:text-base md:text-lg tracking-wide text-cream mb-2 sm:mb-2.5 group-hover:text-gold transition-colors duration-300 line-clamp-1">
            {title}
          </h3>
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <div className="text-[11px] sm:text-xs text-cream/55 space-y-0.5 leading-tight">
              {dress.price_sale != null && (
                <p className="font-medium">{formatPrice(dress.price_sale)}</p>
              )}
              {dress.price_rental != null && dress.availability !== 'sale' && (
                <p className="text-gold/70">{formatPrice(dress.price_rental)}</p>
              )}
            </div>
            <span className="text-[10px] sm:text-[11px] tracking-widest uppercase text-gold/60 group-hover:text-gold transition-all duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 flex-shrink-0">
              →
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
