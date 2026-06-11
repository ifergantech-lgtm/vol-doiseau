'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAdminT, type AdminLang, type AdminStringKey } from './adminI18n'

const links: { href: string; key: AdminStringKey }[] = [
  { href: '/admin', key: 'dashboard' },
  { href: '/admin/dresses', key: 'dresses' },
  { href: '/admin/enquiries', key: 'enquiries' },
  { href: '/admin/classes', key: 'classes' },
  { href: '/admin/social', key: 'social' },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { lang, setLang, t } = useAdminT()

  async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/admin/login')
  }

  return (
    <aside className="w-52 flex-shrink-0 border-e border-gold/10 flex flex-col">
      <div className="p-6 border-b border-gold/10">
        <p
          className="text-sm font-display tracking-[0.2em] uppercase"
          style={{
            background: 'linear-gradient(135deg, #b8860b, #c9a84c, #e8c97a)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Vol D&apos;Oiseau
        </p>
        <p className="text-[9px] tracking-widest uppercase text-cream/30 mt-0.5">Admin</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-3 py-2 rounded text-xs tracking-widest uppercase transition-colors ${
              pathname === link.href
                ? 'bg-gold/10 text-gold'
                : 'text-cream/50 hover:text-cream hover:bg-white/5'
            }`}
          >
            {t(link.key)}
          </Link>
        ))}
      </nav>
      {/* Language toggle */}
      <div className="px-4 pb-2">
        <div className="flex border border-gold/15 rounded overflow-hidden">
          {(['fr', 'en'] as AdminLang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`flex-1 py-2 text-[10px] tracking-widest uppercase transition-colors ${
                lang === l ? 'bg-gold/15 text-gold' : 'text-cream/40 hover:text-cream'
              }`}
            >
              {l === 'fr' ? 'Français' : 'English'}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4 border-t border-gold/10">
        <button
          onClick={logout}
          className="w-full text-xs tracking-widest uppercase text-cream/30 hover:text-cream transition-colors text-start px-3 py-2"
        >
          {t('logout')}
        </button>
      </div>
    </aside>
  )
}
