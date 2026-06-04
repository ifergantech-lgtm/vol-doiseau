'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { buildSlug } from '@/lib/utils'

interface DressData {
  id?: string
  slug?: string
  title?: Record<string, string>
  description?: Record<string, string>
  category?: string
  availability?: string
  price_sale?: number | null
  price_rental?: number | null
  images?: string[]
  is_featured?: boolean
  is_active?: boolean
}

const LOCALES = ['en', 'fr', 'he'] as const
const CATEGORIES = ['evening', 'wedding'] as const
const AVAILABILITIES = ['sale', 'rental', 'both'] as const

export default function DressForm({ initial }: { initial?: DressData }) {
  const router = useRouter()
  const [activeLang, setActiveLang] = useState<'en' | 'fr' | 'he'>('en')
  const [title, setTitle] = useState<Record<string, string>>(initial?.title || {})
  const [description, setDescription] = useState<Record<string, string>>(initial?.description || {})
  const [category, setCategory] = useState(initial?.category || 'evening')
  const [availability, setAvailability] = useState(initial?.availability || 'both')
  const [priceSale, setPriceSale] = useState<string>(initial?.price_sale?.toString() || '')
  const [priceRental, setPriceRental] = useState<string>(initial?.price_rental?.toString() || '')
  const [isFeatured, setIsFeatured] = useState(initial?.is_featured || false)
  const [isActive, setIsActive] = useState(initial?.is_active ?? true)
  const [images, setImages] = useState<string[]>(initial?.images || [])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function uploadImage(file: File) {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    setUploading(false)
    return data.path as string
  }

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    const paths: string[] = []
    for (const file of files) {
      const path = await uploadImage(file)
      if (path) paths.push(path)
    }
    setImages((prev) => [...prev, ...paths])
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    const slug = initial?.slug || buildSlug(title.en || title.fr || title.he || 'dress')
    const payload = {
      slug,
      title,
      description,
      category,
      availability,
      price_sale: priceSale ? parseFloat(priceSale) : null,
      price_rental: priceRental ? parseFloat(priceRental) : null,
      is_featured: isFeatured,
      is_active: isActive,
      images,
    }

    const url = initial?.id ? `/api/dresses/${initial.id}` : '/api/dresses'
    const method = initial?.id ? 'PATCH' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      setError('Failed to save. Please try again.')
      setSaving(false)
      return
    }

    router.push('/admin/dresses')
    router.refresh()
  }

  return (
    <div className="max-w-2xl space-y-8">
      {/* Language tabs */}
      <div className="flex gap-1 border-b border-gold/10 pb-4">
        {LOCALES.map((l) => (
          <button
            key={l}
            onClick={() => setActiveLang(l)}
            className={`px-4 py-2 text-[10px] tracking-widest uppercase transition-colors ${
              activeLang === l ? 'text-gold border-b-2 border-gold' : 'text-cream/40 hover:text-cream'
            }`}
          >
            {l === 'he' ? 'עברית' : l === 'fr' ? 'Français' : 'English'}
          </button>
        ))}
      </div>

      {/* Title */}
      <div>
        <label className="block text-[10px] tracking-widest uppercase text-cream/40 mb-1.5">
          Title ({activeLang})
        </label>
        <input
          value={title[activeLang] || ''}
          onChange={(e) => setTitle((p) => ({ ...p, [activeLang]: e.target.value }))}
          className="w-full bg-navy border border-gold/20 px-4 py-3 text-sm text-cream focus:outline-none focus:border-gold/50 transition-colors"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-[10px] tracking-widest uppercase text-cream/40 mb-1.5">
          Description ({activeLang})
        </label>
        <textarea
          rows={4}
          value={description[activeLang] || ''}
          onChange={(e) => setDescription((p) => ({ ...p, [activeLang]: e.target.value }))}
          className="w-full bg-navy border border-gold/20 px-4 py-3 text-sm text-cream focus:outline-none focus:border-gold/50 transition-colors resize-none"
        />
      </div>

      {/* Category + Availability */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] tracking-widest uppercase text-cream/40 mb-1.5">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-navy border border-gold/20 px-4 py-3 text-sm text-cream focus:outline-none focus:border-gold/50 transition-colors"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] tracking-widest uppercase text-cream/40 mb-1.5">Availability</label>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="w-full bg-navy border border-gold/20 px-4 py-3 text-sm text-cream focus:outline-none focus:border-gold/50 transition-colors"
          >
            {AVAILABILITIES.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Prices */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] tracking-widest uppercase text-cream/40 mb-1.5">Sale price (₪)</label>
          <input
            type="number"
            value={priceSale}
            onChange={(e) => setPriceSale(e.target.value)}
            placeholder="e.g. 2500"
            className="w-full bg-navy border border-gold/20 px-4 py-3 text-sm text-cream focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-[10px] tracking-widest uppercase text-cream/40 mb-1.5">Rental price (₪)</label>
          <input
            type="number"
            value={priceRental}
            onChange={(e) => setPriceRental(e.target.value)}
            placeholder="e.g. 800"
            className="w-full bg-navy border border-gold/20 px-4 py-3 text-sm text-cream focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="flex gap-6">
        {[
          { label: 'Featured', value: isFeatured, set: setIsFeatured },
          { label: 'Active', value: isActive, set: setIsActive },
        ].map(({ label, value, set }) => (
          <label key={label} className="flex items-center gap-2 cursor-pointer">
            <div
              onClick={() => set(!value)}
              className={`w-10 h-5 rounded-full relative transition-colors ${value ? 'bg-gold' : 'bg-cream/10'}`}
            >
              <span
                className={`absolute top-0.5 start-0.5 w-4 h-4 rounded-full bg-white transition-transform ${value ? 'translate-x-5' : ''}`}
              />
            </div>
            <span className="text-xs tracking-widest uppercase text-cream/60">{label}</span>
          </label>
        ))}
      </div>

      {/* Images */}
      <div>
        <label className="block text-[10px] tracking-widest uppercase text-cream/40 mb-2">Photos</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {images.map((img, i) => (
            <div key={i} className="relative w-16 h-20 border border-gold/10">
              <button
                onClick={() => setImages((p) => p.filter((_, j) => j !== i))}
                className="absolute -top-1.5 -end-1.5 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center z-10"
              >
                ×
              </button>
              <div className="w-full h-full bg-navy-deep flex items-center justify-center text-cream/20 text-[9px]">
                {img.slice(-8)}
              </div>
            </div>
          ))}
        </div>
        <label className="inline-flex items-center gap-2 px-4 py-2 border border-gold/20 text-xs tracking-widest uppercase text-cream/50 hover:border-gold/50 hover:text-cream cursor-pointer transition-colors">
          {uploading ? 'Uploading…' : '+ Add photos'}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFiles}
            disabled={uploading}
          />
        </label>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="flex gap-3 pt-4 border-t border-gold/10">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 text-xs tracking-widest uppercase font-medium text-navy-deep disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #b8860b, #c9a84c, #e8c97a, #c9a84c)' }}
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 text-xs tracking-widest uppercase border border-gold/20 text-cream/50 hover:text-cream transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
