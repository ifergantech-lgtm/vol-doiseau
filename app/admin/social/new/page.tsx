'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Dress {
  id: string
  title: Record<string, string>
  images: string[]
  category: string
  is_active: boolean
}

export default function NewSocialPost() {
  const router = useRouter()
  const [dresses, setDresses] = useState<Dress[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('dresses')
      .select('id, title, images, category, is_active')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setDresses(data || [])
        setLoading(false)
      })
  }, [])

  async function handleGenerate() {
    if (!selectedId) { setError('Please select a dress first.'); return }
    setError('')
    setGenerating(true)
    try {
      const res = await fetch('/api/social/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dressId: selectedId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      // Redirect to the review page — it will poll for video completion
      router.push(`/admin/social/${data.postId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setGenerating(false)
    }
  }

  const selectedDress = dresses.find((d) => d.id === selectedId)

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-2xl tracking-[0.15em] uppercase text-cream mb-8">
        New Post
      </h1>

      <div className="space-y-6">
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-cream/40 mb-3">
            Choose a dress
          </label>
          {loading ? (
            <p className="text-cream/30 text-sm">Loading dresses…</p>
          ) : (
            <div className="space-y-2">
              {dresses.map((dress) => {
                const title = dress.title?.en || dress.title?.fr || dress.title?.he
                const thumb = dress.images?.[0] || ''
                const isSelected = dress.id === selectedId
                return (
                  <button
                    key={dress.id}
                    onClick={() => setSelectedId(dress.id)}
                    className={`w-full flex items-center gap-3 p-3 border text-start transition-colors ${
                      isSelected
                        ? 'border-gold/50 bg-gold/5'
                        : 'border-gold/10 hover:border-gold/25'
                    }`}
                  >
                    {thumb ? (
                      <div className="relative w-10 h-14 flex-shrink-0 overflow-hidden rounded-sm">
                        <Image src={thumb} alt={title} fill sizes="40px" className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-14 flex-shrink-0 bg-white/5 rounded-sm" />
                    )}
                    <div>
                      <p className="text-sm text-cream">{title}</p>
                      <p className="text-[10px] text-cream/40 uppercase tracking-widest">
                        {dress.category}
                      </p>
                    </div>
                    {isSelected && (
                      <span className="ms-auto text-[9px] tracking-widest uppercase text-gold">
                        Selected
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {selectedDress && (
          <div className="border border-gold/10 p-4 bg-white/[0.02]">
            <p className="text-[10px] tracking-[0.15em] uppercase text-cream/30 mb-2">
              What will happen
            </p>
            <ul className="space-y-1.5 text-xs text-cream/60">
              <li>1. Higgsfield AI turns the dress photo into a short cinematic video</li>
              <li>2. Claude writes captions in French, English, and Hebrew</li>
              <li>3. A draft is saved for you to review and edit before it posts</li>
            </ul>
            <p className="text-[10px] text-cream/30 mt-3">
              Video generation takes 1–3 minutes.
            </p>
          </div>
        )}

        {error && (
          <p className="text-red-400 text-xs">{error}</p>
        )}

        <button
          onClick={handleGenerate}
          disabled={!selectedId || generating}
          className="w-full py-3 text-xs tracking-widest uppercase font-medium text-navy-deep disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          style={{ background: 'linear-gradient(135deg, #b8860b, #c9a84c, #e8c97a, #c9a84c)' }}
        >
          {generating ? 'Starting generation…' : 'Generate Content'}
        </button>
      </div>
    </div>
  )
}
