'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'

interface SocialPost {
  id: string
  status: string
  caption_fr: string
  scheduled_at: string | null
  created_at: string
  platforms: string[]
  video_path: string | null
  dress: {
    id: string
    title: Record<string, string>
    images: string[]
    category: string
  } | null
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  generating: { label: 'Generating…', color: 'text-amber-400 border-amber-400/30' },
  draft:      { label: 'Draft',       color: 'text-blue-300 border-blue-300/30' },
  approved:   { label: 'Approved',    color: 'text-emerald-400 border-emerald-400/30' },
  scheduled:  { label: 'Scheduled',   color: 'text-gold border-gold/30' },
  published:  { label: 'Published',   color: 'text-cream/60 border-cream/20' },
  failed:     { label: 'Failed',      color: 'text-red-400 border-red-400/30' },
}

export default function SocialDashboard() {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [loading, setLoading] = useState(true)

  function load() {
    const supabase = createClient()
    supabase
      .from('social_posts')
      .select('*, dress:dress_id(id, title, images, category)')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setPosts((data as SocialPost[]) || [])
        setLoading(false)
      })
  }

  useEffect(() => { load() }, [])

  async function deletePost(id: string) {
    if (!confirm('Delete this post?')) return
    await fetch(`/api/social/posts/${id}`, { method: 'DELETE' })
    load()
  }

  const groups = ['generating', 'draft', 'scheduled', 'published', 'failed'] as const

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl tracking-[0.15em] uppercase text-cream">
          Social Media
        </h1>
        <Link
          href="/admin/social/new"
          className="px-5 py-2.5 text-xs tracking-widest uppercase font-medium text-navy-deep"
          style={{ background: 'linear-gradient(135deg, #b8860b, #c9a84c, #e8c97a, #c9a84c)' }}
        >
          + New Post
        </Link>
      </div>

      {loading ? (
        <p className="text-cream/30 text-sm">Loading…</p>
      ) : posts.length === 0 ? (
        <div className="border border-gold/10 p-10 text-center">
          <p className="text-cream/30 text-sm tracking-widest uppercase mb-4">No posts yet</p>
          <Link
            href="/admin/social/new"
            className="text-xs tracking-widest uppercase text-gold hover:text-gold/70 transition-colors"
          >
            Generate your first post →
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map((status) => {
            const group = posts.filter((p) => p.status === status)
            if (group.length === 0) return null
            const { label } = STATUS_LABELS[status]
            return (
              <div key={status}>
                <p className="text-[10px] tracking-[0.25em] uppercase text-cream/30 mb-3">{label}</p>
                <div className="space-y-2">
                  {group.map((post) => {
                    const thumb = post.dress?.images?.[0] || ''
                    const title = post.dress?.title?.en || post.dress?.title?.fr || 'Dress'
                    const { color } = STATUS_LABELS[post.status] || STATUS_LABELS.draft
                    return (
                      <div
                        key={post.id}
                        className="flex items-center gap-4 border border-gold/10 p-3 hover:border-gold/20 transition-colors"
                      >
                        {thumb ? (
                          <div className="relative w-10 h-14 flex-shrink-0 overflow-hidden rounded-sm">
                            <Image src={thumb} alt={title} fill sizes="40px" className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-14 flex-shrink-0 bg-white/5 rounded-sm" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-cream truncate">{title}</p>
                          <p className="text-[10px] text-cream/40 uppercase tracking-widest truncate">
                            {post.caption_fr
                              ? post.caption_fr.slice(0, 60) + '…'
                              : 'Generating captions…'}
                          </p>
                          {post.scheduled_at && (
                            <p className="text-[10px] text-gold/60 mt-0.5">
                              {new Date(post.scheduled_at).toLocaleDateString('en-GB', {
                                day: '2-digit', month: 'short', year: 'numeric',
                                hour: '2-digit', minute: '2-digit',
                              })}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className={`text-[9px] tracking-widest uppercase px-2 py-1 border ${color}`}>
                            {STATUS_LABELS[post.status]?.label}
                          </span>
                          {(post.status === 'draft' || post.status === 'generating') && (
                            <Link
                              href={`/admin/social/${post.id}`}
                              className="text-[10px] tracking-widest uppercase text-cream/40 hover:text-gold transition-colors"
                            >
                              Review
                            </Link>
                          )}
                          <button
                            onClick={() => deletePost(post.id)}
                            className="text-[10px] tracking-widest uppercase text-red-400/50 hover:text-red-400 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
