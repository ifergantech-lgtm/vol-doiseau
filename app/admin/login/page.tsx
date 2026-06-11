'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAdminT } from '../adminI18n'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t } = useAdminT()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(t('invalidCredentials'))
      setLoading(false)
    } else {
      router.replace('/admin')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-navy">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p
            className="font-display text-2xl tracking-[0.25em] uppercase"
            style={{
              background: 'linear-gradient(135deg, #b8860b, #c9a84c, #e8c97a, #c9a84c)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Vol D&apos;Oiseau
          </p>
          <p className="text-[9px] tracking-[0.4em] uppercase text-cream/30 mt-1">Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-cream/40 mb-1.5">
              {t('email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-navy-deep border border-gold/20 px-4 py-3 text-sm text-cream focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-cream/40 mb-1.5">
              {t('password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-navy-deep border border-gold/20 px-4 py-3 text-sm text-cream focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-xs tracking-widest uppercase font-medium text-navy-deep disabled:opacity-50 transition-opacity"
            style={{ background: 'linear-gradient(135deg, #b8860b, #c9a84c, #e8c97a, #c9a84c)' }}
          >
            {loading ? '...' : t('login')}
          </button>
        </form>
      </div>
    </div>
  )
}
