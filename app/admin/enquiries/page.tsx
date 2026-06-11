'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAdminT, type AdminStringKey } from '../adminI18n'

interface Enquiry {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  enquiry_type: string
  status: string
  created_at: string
  dresses?: { slug: string; title: Record<string, string> } | null
}

const STATUS_COLORS: Record<string, string> = {
  new: 'text-gold border-gold/40',
  read: 'text-cream/50 border-cream/20',
  replied: 'text-green-400/60 border-green-400/30',
}

const STATUS_KEYS: Record<string, AdminStringKey> = {
  new: 'statusNew',
  read: 'statusRead',
  replied: 'statusReplied',
}

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { t } = useAdminT()

  function load() {
    const supabase = createClient()
    supabase
      .from('enquiries')
      .select('*, dresses(slug, title)')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setEnquiries((data as Enquiry[]) || [])
        setLoading(false)
      })
  }

  useEffect(() => { load() }, [])

  async function setStatus(id: string, status: string) {
    const supabase = createClient()
    await supabase.from('enquiries').update({ status }).eq('id', id)
    load()
  }

  return (
    <div>
      <h1 className="font-display text-2xl tracking-[0.15em] uppercase text-cream mb-8">{t('enquiries')}</h1>
      {loading ? (
        <p className="text-cream/30 text-sm">{t('loading')}</p>
      ) : enquiries.length === 0 ? (
        <p className="text-cream/30 text-sm tracking-widest uppercase">{t('noEnquiries')}</p>
      ) : (
        <div className="space-y-2">
          {enquiries.map((enq) => (
            <div key={enq.id} className="border border-gold/10 hover:border-gold/20 transition-colors">
              <button
                onClick={() => setExpanded(expanded === enq.id ? null : enq.id)}
                className="w-full flex items-center gap-4 p-4 text-start"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm text-cream">{enq.name}</span>
                    <span className="text-[9px] tracking-widest uppercase text-cream/30">{enq.enquiry_type}</span>
                    {enq.dresses && (
                      <span className="text-[9px] tracking-widest text-gold/50">
                        {enq.dresses.title?.en || enq.dresses.slug}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-cream/40 truncate">{enq.message}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-[9px] text-cream/30">
                    {new Date(enq.created_at).toLocaleDateString()}
                  </span>
                  <span
                    className={`text-[9px] tracking-widest uppercase px-2 py-0.5 border ${STATUS_COLORS[enq.status] || ''}`}
                  >
                    {STATUS_KEYS[enq.status] ? t(STATUS_KEYS[enq.status]) : enq.status}
                  </span>
                </div>
              </button>

              {expanded === enq.id && (
                <div className="px-4 pb-4 pt-0 border-t border-gold/10 space-y-3">
                  <p className="text-sm text-cream/70 leading-relaxed">{enq.message}</p>
                  <div className="flex gap-3 text-[10px]">
                    <a href={`mailto:${enq.email}`} className="text-gold hover:underline">{enq.email}</a>
                    {enq.phone && <span className="text-cream/40">{enq.phone}</span>}
                  </div>
                  <div className="flex gap-2">
                    {['new', 'read', 'replied'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatus(enq.id, s)}
                        className={`text-[9px] tracking-widest uppercase px-3 py-1 border transition-colors ${
                          enq.status === s
                            ? STATUS_COLORS[s]
                            : 'border-cream/10 text-cream/30 hover:border-cream/30'
                        }`}
                      >
                        {t(STATUS_KEYS[s])}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
