'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'

interface Dress {
  id: string
  slug: string
  title: Record<string, string>
  category: string
  availability: string
  price_sale: number | null
  price_rental: number | null
  images: string[]
  is_active: boolean
  is_featured: boolean
}

export default function AdminDresses() {
  const [dresses, setDresses] = useState<Dress[]>([])
  const [loading, setLoading] = useState(true)

  function load() {
    const supabase = createClient()
    supabase
      .from('dresses')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setDresses(data || [])
        setLoading(false)
      })
  }

  useEffect(() => { load() }, [])

  async function toggleActive(id: string, current: boolean) {
    const supabase = createClient()
    await supabase.from('dresses').update({ is_active: !current }).eq('id', id)
    load()
  }

  async function deleteDress(id: string) {
    if (!confirm('Delete this dress?')) return
    const supabase = createClient()
    await supabase.from('dresses').delete().eq('id', id)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl tracking-[0.15em] uppercase text-cream">Dresses</h1>
        <Link
          href="/admin/dresses/new"
          className="px-5 py-2.5 text-xs tracking-widest uppercase font-medium text-navy-deep"
          style={{ background: 'linear-gradient(135deg, #b8860b, #c9a84c, #e8c97a, #c9a84c)' }}
        >
          + Add dress
        </Link>
      </div>

      {loading ? (
        <p className="text-cream/30 text-sm">Loading…</p>
      ) : dresses.length === 0 ? (
        <p className="text-cream/30 text-sm tracking-widest uppercase">No dresses yet</p>
      ) : (
        <div className="space-y-2">
          {dresses.map((dress) => {
            const thumb = dress.images[0] || `https://picsum.photos/seed/${dress.slug}/200/267`
            const title = dress.title?.en || dress.title?.fr || dress.title?.he || dress.slug
            return (
              <div
                key={dress.id}
                className="flex items-center gap-4 border border-gold/10 p-3 hover:border-gold/20 transition-colors"
              >
                <div className="relative w-10 h-14 flex-shrink-0 overflow-hidden rounded-sm">
                  <Image src={thumb} alt={title} fill sizes="40px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-cream truncate">{title}</p>
                  <p className="text-[10px] text-cream/40 uppercase tracking-widest">
                    {dress.category} · {dress.availability}
                    {dress.price_sale ? ` · ${formatPrice(dress.price_sale)}` : ''}
                    {dress.price_rental ? ` / ${formatPrice(dress.price_rental)}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={() => toggleActive(dress.id, dress.is_active)}
                    className={`text-[9px] tracking-widest uppercase px-2 py-1 border transition-colors ${
                      dress.is_active
                        ? 'border-gold/30 text-gold'
                        : 'border-cream/20 text-cream/30'
                    }`}
                  >
                    {dress.is_active ? 'Active' : 'Hidden'}
                  </button>
                  <Link
                    href={`/admin/dresses/${dress.id}`}
                    className="text-[10px] tracking-widest uppercase text-cream/40 hover:text-gold transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteDress(dress.id)}
                    className="text-[10px] tracking-widest uppercase text-red-400/50 hover:text-red-400 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
