'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useAdminT } from './adminI18n'

interface Stats {
  totalDresses: number
  activeDresses: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const { t } = useAdminT()

  useEffect(() => {
    const supabase = createClient()
    supabase.from('dresses').select('id, is_active').then(({ data: dresses }) => {
      setStats({
        totalDresses: dresses?.length || 0,
        activeDresses: dresses?.filter((d) => d.is_active).length || 0,
      })
    })
  }, [])

  const tiles = [
    { label: t('totalDresses'), value: stats?.totalDresses, href: '/admin/dresses' },
    { label: t('activeDresses'), value: stats?.activeDresses, href: '/admin/dresses' },
  ]

  return (
    <div>
      <h1 className="font-display text-2xl tracking-[0.15em] uppercase text-cream mb-8">{t('dashboard')}</h1>
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {tiles.map((tile) => (
          <Link
            key={tile.label}
            href={tile.href}
            className="border border-gold/10 p-6 transition-colors hover:border-gold/40"
          >
            <p className="text-[10px] tracking-widest uppercase text-cream/40 mb-2">{tile.label}</p>
            <p className="font-display text-4xl">
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
      </div>
    </div>
  )
}
