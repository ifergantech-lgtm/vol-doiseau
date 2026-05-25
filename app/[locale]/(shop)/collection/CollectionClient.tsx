'use client'

import { useState } from 'react'
import DressCard from '@/components/DressCard'
import Reveal from '@/components/Reveal'
import type { Locale } from '@/lib/utils'

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

interface Labels {
  all: string
  evening: string
  wedding: string
  cocktail: string
  sale: string
  rental: string
  empty: string
  saleLabel: string
  rentalLabel: string
  bothLabel: string
}

export default function CollectionClient({
  dresses,
  locale,
  labels,
}: {
  dresses: Dress[]
  locale: Locale
  labels: Labels
}) {
  const [category, setCategory] = useState('all')
  const [availability, setAvailability] = useState('all')

  const filtered = dresses.filter((d) => {
    const catOk = category === 'all' || d.category === category
    const avOk =
      availability === 'all' ||
      d.availability === availability ||
      d.availability === 'both'
    return catOk && avOk
  })

  const categoryFilters = [
    { key: 'all', label: labels.all },
    { key: 'evening', label: labels.evening },
    { key: 'wedding', label: labels.wedding },
    { key: 'cocktail', label: labels.cocktail },
  ]

  const availFilters = [
    { key: 'all', label: labels.all },
    { key: 'sale', label: labels.sale },
    { key: 'rental', label: labels.rental },
  ]

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-6 py-10 sm:py-12">
      {/* Filters — horizontal scroll on mobile, wrap on larger screens */}
      <div className="mb-10 sm:mb-12 space-y-3 sm:space-y-0 sm:flex sm:flex-wrap sm:gap-8 animate-fade-in-up">
        <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0 sm:overflow-visible">
          <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
            {categoryFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => setCategory(f.key)}
                className={`text-[10px] tracking-[0.2em] uppercase px-4 py-2.5 border transition-all whitespace-nowrap ${
                  category === f.key
                    ? 'border-gold text-gold bg-gold/10 shadow-[inset_0_0_20px_rgba(201,168,76,0.1)]'
                    : 'border-gold/20 text-cream/55 hover:border-gold/40 hover:text-cream/85 active:bg-gold/5'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0 sm:overflow-visible">
          <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
            {availFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => setAvailability(f.key)}
                className={`text-[10px] tracking-[0.2em] uppercase px-4 py-2.5 border transition-all whitespace-nowrap ${
                  availability === f.key
                    ? 'border-gold text-gold bg-gold/10 shadow-[inset_0_0_20px_rgba(201,168,76,0.1)]'
                    : 'border-gold/20 text-cream/55 hover:border-gold/40 hover:text-cream/85 active:bg-gold/5'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result count + grid */}
      <p className="text-[10px] tracking-[0.4em] uppercase text-gold/40 mb-6 animate-fade-in delay-200">
        {filtered.length} —
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-24 animate-fade-in">
          <p className="text-cream/30 text-sm tracking-widest uppercase">{labels.empty}</p>
        </div>
      ) : (
        <Reveal stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filtered.map((dress) => (
            <DressCard
              key={dress.id}
              dress={dress}
              locale={locale}
              availabilityLabels={{
                sale: labels.saleLabel,
                rental: labels.rentalLabel,
                both: labels.bothLabel,
              }}
            />
          ))}
        </Reveal>
      )}
    </div>
  )
}
