'use client'

import { use, useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Post {
  id: string
  status: string
  caption_he: string
  caption_fr: string
  caption_en: string
  hashtags: string
  selected_languages: string[]
  platforms: string[]
  scheduled_at: string | null
  video_path: string | null
  image_path: string
  dress: {
    title: Record<string, string>
    images: string[]
    category: string
  } | null
}

const LANGS = [
  { key: 'fr', label: 'French', dir: 'ltr' },
  { key: 'en', label: 'English', dir: 'ltr' },
  { key: 'he', label: 'Hebrew', dir: 'rtl' },
] as const

export default function ReviewPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [scheduling, setScheduling] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchPost = useCallback(async () => {
    const res = await fetch(`/api/social/posts/${id}`)
    if (res.ok) {
      const data = await res.json()
      setPost(data)
      setLoading(false)
      return data
    }
    setLoading(false)
    return null
  }, [id])

  // Poll status until video is ready
  const pollStatus = useCallback(async () => {
    const res = await fetch(`/api/social/posts/${id}/status`)
    if (!res.ok) return
    const { status, videoPath } = await res.json()
    if (status !== 'generating') {
      if (pollRef.current) clearInterval(pollRef.current)
      setPost((prev) => prev ? { ...prev, status, video_path: videoPath } : prev)
    }
  }, [id])

  useEffect(() => {
    fetchPost().then((data) => {
      if (data?.status === 'generating') {
        pollRef.current = setInterval(pollStatus, 5000)
      }
    })
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [fetchPost, pollStatus])

  async function save() {
    if (!post) return
    setSaving(true)
    setError('')
    const res = await fetch(`/api/social/posts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        caption_fr: post.caption_fr,
        caption_en: post.caption_en,
        caption_he: post.caption_he,
        hashtags: post.hashtags,
        selected_languages: post.selected_languages,
        platforms: post.platforms,
        scheduled_at: post.scheduled_at,
      }),
    })
    setSaving(false)
    if (!res.ok) setError('Failed to save changes.')
    else setSuccess('Saved.')
  }

  async function approve() {
    if (!post?.scheduled_at) { setError('Please set a scheduled date and time first.'); return }
    setError('')
    setScheduling(true)
    await save()
    const res = await fetch(`/api/social/posts/${id}/approve`, { method: 'POST' })
    const data = await res.json()
    setScheduling(false)
    if (!res.ok) {
      setError(data.error || 'Failed to schedule post.')
    } else {
      setSuccess('Post scheduled successfully!')
      router.push('/admin/social')
    }
  }

  function toggleLang(lang: string) {
    if (!post) return
    const has = post.selected_languages.includes(lang)
    setPost({
      ...post,
      selected_languages: has
        ? post.selected_languages.filter((l) => l !== lang)
        : [...post.selected_languages, lang],
    })
  }

  function buildPreview() {
    if (!post) return ''
    const parts: string[] = []
    for (const l of LANGS) {
      if (!post.selected_languages.includes(l.key)) continue
      const caption = l.key === 'fr' ? post.caption_fr
        : l.key === 'en' ? post.caption_en
        : post.caption_he
      if (caption) parts.push(caption)
    }
    if (post.hashtags) parts.push(post.hashtags)
    return parts.join('\n\n')
  }

  if (loading) {
    return <p className="text-cream/30 text-sm">Loading…</p>
  }

  if (!post) {
    return <p className="text-red-400 text-sm">Post not found.</p>
  }

  const thumbUrl = post.dress?.images?.[0] || ''
  const title = post.dress?.title?.en || post.dress?.title?.fr || 'Dress'

  return (
    <div className="max-w-2xl space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl tracking-[0.15em] uppercase text-cream">
          Review Post
        </h1>
        <span className={`text-[9px] tracking-widest uppercase px-2 py-1 border ${
          post.status === 'generating' ? 'text-amber-400 border-amber-400/30'
          : post.status === 'draft'     ? 'text-blue-300 border-blue-300/30'
          : post.status === 'scheduled' ? 'text-gold border-gold/30'
          : 'text-cream/40 border-cream/20'
        }`}>
          {post.status}
        </span>
      </div>

      {/* Dress + Video preview */}
      <div className="flex gap-4">
        {thumbUrl && (
          <div className="relative w-28 h-40 flex-shrink-0 overflow-hidden rounded-sm">
            <Image src={thumbUrl} alt={title} fill sizes="112px" className="object-cover" />
          </div>
        )}
        <div className="flex-1">
          <p className="text-cream text-sm mb-1">{title}</p>
          <p className="text-[10px] text-cream/40 uppercase tracking-widest mb-4">
            {post.dress?.category}
          </p>
          {post.status === 'generating' ? (
            <div className="border border-gold/10 p-4 text-center">
              <div className="w-4 h-4 border border-gold/40 border-t-gold rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-cream/40">Generating video…</p>
              <p className="text-[10px] text-cream/25 mt-1">Usually takes 1–3 minutes</p>
            </div>
          ) : post.video_path ? (
            <div>
              <p className="text-[10px] tracking-[0.15em] uppercase text-cream/30 mb-2">
                Generated video
              </p>
              <video
                src={post.video_path}
                controls
                className="w-full rounded-sm border border-gold/10"
                style={{ maxHeight: '200px' }}
              />
            </div>
          ) : (
            <p className="text-xs text-red-400">Video generation failed.</p>
          )}
        </div>
      </div>

      {/* Captions */}
      <div className="space-y-4">
        <p className="text-[10px] tracking-[0.2em] uppercase text-cream/40">Captions</p>
        {LANGS.map(({ key, label, dir }) => {
          const value = key === 'fr' ? post.caption_fr : key === 'en' ? post.caption_en : post.caption_he
          return (
            <div key={key}>
              <label className="block text-[10px] tracking-widest uppercase text-cream/30 mb-1.5">
                {label}
              </label>
              <textarea
                value={value}
                dir={dir}
                onChange={(e) => setPost({ ...post, [`caption_${key}`]: e.target.value })}
                rows={3}
                className="w-full bg-white/5 border border-gold/10 p-3 text-sm text-cream placeholder-cream/20 focus:outline-none focus:border-gold/30 resize-none"
              />
            </div>
          )
        })}
        <div>
          <label className="block text-[10px] tracking-widest uppercase text-cream/30 mb-1.5">
            Hashtags
          </label>
          <textarea
            value={post.hashtags}
            onChange={(e) => setPost({ ...post, hashtags: e.target.value })}
            rows={2}
            className="w-full bg-white/5 border border-gold/10 p-3 text-sm text-cream placeholder-cream/20 focus:outline-none focus:border-gold/30 resize-none"
          />
        </div>
      </div>

      {/* Language selection */}
      <div>
        <p className="text-[10px] tracking-[0.2em] uppercase text-cream/40 mb-3">
          Languages to include in post
        </p>
        <div className="flex gap-3">
          {LANGS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => toggleLang(key)}
              className={`px-4 py-2 text-xs tracking-widest uppercase border transition-colors ${
                post.selected_languages.includes(key)
                  ? 'border-gold/50 text-gold bg-gold/5'
                  : 'border-gold/10 text-cream/30 hover:border-gold/25'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Caption preview */}
      {post.selected_languages.length > 0 && (
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-cream/40 mb-3">
            Preview (as it will appear on Instagram)
          </p>
          <div className="border border-gold/10 p-4 bg-white/[0.02]">
            <pre className="text-xs text-cream/70 whitespace-pre-wrap font-sans leading-relaxed">
              {buildPreview() || '(no caption selected)'}
            </pre>
          </div>
        </div>
      )}

      {/* Schedule */}
      <div>
        <label className="block text-[10px] tracking-[0.2em] uppercase text-cream/40 mb-3">
          Schedule date & time
        </label>
        <input
          type="datetime-local"
          value={post.scheduled_at ? post.scheduled_at.slice(0, 16) : ''}
          onChange={(e) => setPost({ ...post, scheduled_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
          className="bg-white/5 border border-gold/10 p-3 text-sm text-cream focus:outline-none focus:border-gold/30"
        />
      </div>

      {/* Platforms */}
      <div>
        <p className="text-[10px] tracking-[0.2em] uppercase text-cream/40 mb-3">Platforms</p>
        <div className="flex gap-3">
          {['instagram', 'facebook'].map((platform) => (
            <button
              key={platform}
              onClick={() => {
                const has = post.platforms.includes(platform)
                setPost({
                  ...post,
                  platforms: has
                    ? post.platforms.filter((p) => p !== platform)
                    : [...post.platforms, platform],
                })
              }}
              className={`px-4 py-2 text-xs tracking-widest uppercase border transition-colors capitalize ${
                post.platforms.includes(platform)
                  ? 'border-gold/50 text-gold bg-gold/5'
                  : 'border-gold/10 text-cream/30 hover:border-gold/25'
              }`}
            >
              {platform}
            </button>
          ))}
        </div>
      </div>

      {/* Errors / success */}
      {error && <p className="text-red-400 text-xs">{error}</p>}
      {success && <p className="text-emerald-400 text-xs">{success}</p>}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={save}
          disabled={saving || post.status === 'scheduled'}
          className="px-5 py-2.5 text-xs tracking-widest uppercase border border-gold/30 text-gold hover:bg-gold/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
        <button
          onClick={approve}
          disabled={
            scheduling ||
            post.status !== 'draft' ||
            !post.video_path ||
            !post.scheduled_at
          }
          className="px-5 py-2.5 text-xs tracking-widest uppercase font-medium text-navy-deep disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          style={{ background: 'linear-gradient(135deg, #b8860b, #c9a84c, #e8c97a, #c9a84c)' }}
        >
          {scheduling ? 'Scheduling…' : 'Approve & Schedule'}
        </button>
      </div>

      {post.status !== 'draft' && post.status !== 'generating' && (
        <p className="text-[10px] text-cream/25 tracking-wide">
          {post.status === 'scheduled'
            ? 'This post has been sent to Blotato and is scheduled.'
            : post.status === 'published'
            ? 'This post has been published.'
            : ''}
        </p>
      )}
    </div>
  )
}
