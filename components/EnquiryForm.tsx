'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface EnquiryFormProps {
  enquiryType: 'dress' | 'class' | 'alteration' | 'general'
  dressId?: string
}

export default function EnquiryForm({ enquiryType, dressId }: EnquiryFormProps) {
  const t = useTranslations('contact')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
      enquiry_type: enquiryType,
      dress_id: dressId || null,
    }

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="border border-gold/30 rounded-sm p-8 text-center animate-fade-in-up bg-gold/5">
        <div className="w-12 h-12 rounded-full border border-gold/40 mx-auto mb-4 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10.5l3.5 3.5L16 5.5" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="font-display text-xl text-gold tracking-wide mb-2">{t('success')}</p>
        <p className="text-cream/55 text-sm">{t('success_subtitle')}</p>
      </div>
    )
  }

  const inputClass =
    'w-full bg-navy-deep border border-gold/20 rounded-sm px-4 py-3.5 text-base sm:text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-gold/60 focus:bg-navy/60 transition-all'

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
        <div>
          <label className="block text-[10px] sm:text-xs tracking-[0.3em] uppercase text-cream/55 mb-2">
            {t('name')} *
          </label>
          <input name="name" required autoComplete="name" className={inputClass} />
        </div>
        <div>
          <label className="block text-[10px] sm:text-xs tracking-[0.3em] uppercase text-cream/55 mb-2">
            {t('email')} *
          </label>
          <input name="email" type="email" required autoComplete="email" inputMode="email" className={inputClass} />
        </div>
      </div>
      <div>
        <label className="block text-[10px] sm:text-xs tracking-[0.3em] uppercase text-cream/55 mb-2">
          {t('phone')}
        </label>
        <input name="phone" type="tel" autoComplete="tel" inputMode="tel" className={inputClass} />
      </div>
      <div>
        <label className="block text-[10px] sm:text-xs tracking-[0.3em] uppercase text-cream/55 mb-2">
          {t('message')} *
        </label>
        <textarea
          name="message"
          required
          rows={5}
          className={inputClass + ' resize-none'}
        />
      </div>
      {status === 'error' && (
        <p className="text-xs text-red-400 animate-fade-in">{t('error')}</p>
      )}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-gold w-full py-4 text-xs tracking-widest uppercase font-medium transition-all hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(201,168,76,0.4)] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed text-navy-deep gold-gradient-bg"
      >
        {status === 'loading' ? '...' : t('submit')}
      </button>
    </form>
  )
}
