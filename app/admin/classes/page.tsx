'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const LOCALES = ['en', 'fr', 'he'] as const

interface ClassInfo {
  children_schedule: Record<string, string>
  adults_schedule: Record<string, string>
  price_per_course: number | null
  num_sessions: number
  notes: Record<string, string>
}

export default function AdminClasses() {
  const [info, setInfo] = useState<ClassInfo | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeLang, setActiveLang] = useState<'en' | 'fr' | 'he'>('en')

  useEffect(() => {
    const supabase = createClient()
    supabase.from('class_info').select('*').eq('id', 1).single().then(({ data }) => {
      if (data) setInfo(data)
    })
  }, [])

  async function save() {
    if (!info) return
    setSaving(true)
    const supabase = createClient()
    await supabase.from('class_info').update(info).eq('id', 1)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function updateSchedule(
    type: 'children_schedule' | 'adults_schedule',
    lang: string,
    value: string
  ) {
    setInfo((prev) => prev ? ({
      ...prev,
      [type]: { ...prev[type], [lang]: value },
    }) : prev)
  }

  if (!info) return <p className="text-cream/30 text-sm">Loading…</p>

  return (
    <div>
      <h1 className="font-display text-2xl tracking-[0.15em] uppercase text-cream mb-8">Classes</h1>

      <div className="max-w-xl space-y-8">
        {/* Language tabs */}
        <div className="flex gap-1 border-b border-gold/10 pb-3">
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

        {/* Children schedule */}
        <div>
          <label className="block text-[10px] tracking-widest uppercase text-cream/40 mb-1.5">
            Children schedule ({activeLang})
          </label>
          <input
            value={info.children_schedule?.[activeLang] || ''}
            onChange={(e) => updateSchedule('children_schedule', activeLang, e.target.value)}
            className="w-full bg-navy border border-gold/20 px-4 py-3 text-sm text-cream focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>

        {/* Adults schedule */}
        <div>
          <label className="block text-[10px] tracking-widest uppercase text-cream/40 mb-1.5">
            Adults schedule ({activeLang})
          </label>
          <input
            value={info.adults_schedule?.[activeLang] || ''}
            onChange={(e) => updateSchedule('adults_schedule', activeLang, e.target.value)}
            className="w-full bg-navy border border-gold/20 px-4 py-3 text-sm text-cream focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>

        {/* Price + sessions */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-cream/40 mb-1.5">
              Price per course (₪)
            </label>
            <input
              type="number"
              value={info.price_per_course?.toString() || ''}
              onChange={(e) =>
                setInfo((p) => p ? ({ ...p, price_per_course: e.target.value ? parseFloat(e.target.value) : null }) : p)
              }
              className="w-full bg-navy border border-gold/20 px-4 py-3 text-sm text-cream focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-cream/40 mb-1.5">
              No. of sessions
            </label>
            <input
              type="number"
              value={info.num_sessions}
              onChange={(e) =>
                setInfo((p) => p ? ({ ...p, num_sessions: parseInt(e.target.value) || 6 }) : p)
              }
              className="w-full bg-navy border border-gold/20 px-4 py-3 text-sm text-cream focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="px-8 py-3 text-xs tracking-widest uppercase font-medium text-navy-deep disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #b8860b, #c9a84c, #e8c97a, #c9a84c)' }}
        >
          {saved ? 'Saved ✓' : saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  )
}
