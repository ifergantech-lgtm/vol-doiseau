'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useAdminT } from './adminI18n'

interface Stats {
  totalDresses: number
  activeDresses: number
  newEnquiries: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const { t } = useAdminT()

  useEffect(() => {
    const supabase = createClient()
    Promise.all([
      supabase.from('dresses').select('id, is_active'),
      supabase.from('enquiries').select('id, status').eq('status', 'new'),
    ]).then(([{ data: dresses }, { data: enquiries }]) => {
      setStats({
        totalDresses: dresses?.length || 0,
        activeDresses: dresses?.filter((d) => d.is_active).length || 0,
        newEnquiries: enquiries?.length || 0,
      })
    })
  }, [])

  const tiles = [
    { label: t('totalDresses'), value: stats?.totalDresses, href: '/admin/dresses' },
    { label: t('activeDresses'), value: stats?.activeDresses, href: '/admin/dresses' },
    { label: t('newEnquiries'), value: stats?.newEnquiries, href: '/admin/enquiries', highlight: true },
  ]

  return (
    <div>
      <h1 className="font-display text-2xl tracking-[0.15em] uppercase text-cream mb-8">{t('dashboard')}</h1>
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {tiles.map((tile) => (
          <Link
            key={tile.label}
            href={tile.href}
            className={`border p-6 transition-colors hover:border-gold/40 ${
              tile.highlight ? 'border-gold/30 bg-gold/5' : 'border-gold/10'
            }`}
          >
            <p className="text-[10px] tracking-widest uppercase text-cream/40 mb-2">{tile.label}</p>
            <p
              className="font-display text-4xl"
              style={
                tile.highlight
                  ? {
                      background: 'linear-gradient(135deg, #b8860b, #c9a84c, #e8c97a)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }
                  : {}
              }
            >
              {stats == null ? '—' : tile.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/dresses/new"
          className="px-6 py-3 text-xs tracking-widest uppercase font-medium text-navy-deep"
          style={{ background: 'linear-gradient(135deg, #b8860b, #c9a84c, #e8c97a, #c9a84c)' }}
        >
          {t('addDress')}
        </Link>
        <Link
          href="/admin/enquiries"
          className="px-6 py-3 text-xs tracking-widest uppercase border border-gold/30 text-gold hover:bg-gold/10 transition-all"
        >
          {t('viewEnquiries')}
        </Link>
      </div>
    </div>
  )
}
