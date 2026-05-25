'use client'

import Image from 'next/image'
import { useState } from 'react'

interface DressGalleryProps {
  images: string[]
  slug: string
  title: string
}

export default function DressGallery({ images, slug, title }: DressGalleryProps) {
  const [current, setCurrent] = useState(0)

  const allImages =
    images.length > 0
      ? images
      : [
          `https://picsum.photos/seed/${slug}/800/1100`,
          `https://picsum.photos/seed/${slug}-2/800/1100`,
          `https://picsum.photos/seed/${slug}-3/800/1100`,
        ]

  function prev() {
    setCurrent((c) => (c === 0 ? allImages.length - 1 : c - 1))
  }
  function next() {
    setCurrent((c) => (c === allImages.length - 1 ? 0 : c + 1))
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-navy-deep border border-gold/10">
        <Image
          src={allImages[current]}
          alt={`${title} — ${current + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        {allImages.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute start-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-navy/70 border border-gold/20 text-cream hover:border-gold/60 transition-all rounded-full text-sm"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute end-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-navy/70 border border-gold/20 text-cream hover:border-gold/60 transition-all rounded-full text-sm"
            >
              ›
            </button>
          </>
        )}
        {/* Counter */}
        <span className="absolute bottom-3 end-3 text-[10px] tracking-widest text-cream/50">
          {current + 1} / {allImages.length}
        </span>
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`relative flex-shrink-0 w-16 aspect-[3/4] overflow-hidden rounded-sm border transition-all ${
                i === current ? 'border-gold' : 'border-gold/10 opacity-50 hover:opacity-80'
              }`}
            >
              <Image src={img} alt={`thumb ${i + 1}`} fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
