'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAdminT } from '../adminI18n'

const LOCALES = ['fr', 'en', 'he'] as const

interface ClassInfo {
  children_schedule: Record<string, string>
  adults_schedule: Record<string, string>
  price_per_course: number | null
  num_sessions: number
  notes: Record<string, string>
}

export default function AdminClasses() {
  const { t } = useAdminT()
  const [info, setInfo] = useState<ClassInfo | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeLang, setActiveLang] = useState<'en' | 'fr' | 'he'>('fr')

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

  function updateField(
    field: 'children_schedule' | 'adults_schedule' | 'notes',
    lang: string,
    value: string
  ) {
    setInfo((prev) => prev ? ({
      ...prev,
      [field]: { ...prev[field], [lang]: value },
    }) : prev)
  }

  if (!info) return <p className="text-cream/30 text-sm">{t('loading')}</p>

  const inputClass =
    'w-full bg-navy border border-gold/20 px-4 py-3 text-sm text-cream focus:outline-none focus:border-gold/50 transition-colors'

  return (
    <div>
      <h1 className="font-display text-2xl tracking-[0.15em] uppercase text-cream mb-3">{t('classes')}</h1>
      <p className="text-[11px] text-gold/60 mb-8 max-w-xl leading-relaxed">{t('classesReflectHint')}</p>

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
            {t('childrenScheduleLabel')} ({activeLang})
          </label>
          <input
            value={info.children_schedule?.[activeLang] || ''}
            onChange={(e) => updateField('children_schedule', activeLang, e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Adults schedule */}
        <div>
          <label className="block text-[10px] tracking-widest uppercase text-cream/40 mb-1.5">
            {t('adultsScheduleLabel')} ({activeLang})
          </label>
          <input
            value={info.adults_schedule?.[activeLang] || ''}
            onChange={(e) => updateField('adults_schedule', activeLang, e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Notes — shown on the public classes page */}
        <div>
          <label className="block text-[10px] tracking-widest uppercase text-cream/40 mb-1.5">
            {t('notesLabel')} ({activeLang})
          </label>
          <textarea
            rows={3}
            value={info.notes?.[activeLang] || ''}
            onChange={(e) => updateField('notes', activeLang, e.target.value)}
            className={inputClass + ' resize-none'}
          />
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="px-8 py-3 text-xs tracking-widest uppercase font-medium text-navy-deep disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #b8860b, #c9a84c, #e8c97a, #c9a84c)' }}
        >
          {saved ? t('saved') : saving ? t('saving') : t('save')}
        </button>
      </div>
    </div>
  )
}
