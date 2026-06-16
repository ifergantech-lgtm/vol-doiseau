import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'

export default function Footer() {
  const t = useTranslations('footer')
  const tNav = useTranslations('nav')
  const locale = useLocale()
  const year = new Date().getFullYear()

  const navLinks = [
    { href: `/${locale}/collection`, label: tNav('collection') },
    { href: `/${locale}/services`, label: tNav('services') },
    { href: `/${locale}/classes`, label: tNav('classes') },
    { href: `/${locale}/contact`, label: tNav('contact') },
  ]

  return (
    <footer className="border-t border-gold/20 bg-navy-deep py-12 px-6">
      <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-3 items-start text-center md:text-start">
        <div>
          <p
            className="font-display text-lg tracking-[0.2em] uppercase mb-1"
            style={{
              background: 'linear-gradient(135deg, #b8860b, #c9a84c, #e8c97a, #c9a84c)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Vol D&apos;Oiseau Paris
          </p>
          <p className="text-xs text-cream/50 tracking-wide">{t('tagline')}</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[11px] tracking-widest uppercase text-cream/55 hover:text-gold transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="text-xs text-cream/40 tracking-wide space-y-1 md:text-end">
          <p>{t('address')}</p>
          <p>
            <a href="tel:+972502290718" className="hover:text-gold transition-colors">050-229-0718</a>
          </p>
          <p>© {year} Vol D&apos;Oiseau. {t('rights')}.</p>
        </div>
      </div>
      {/* IferganTech credit */}
      <div style={{ borderTop: '1px solid rgba(127,127,127,0.18)', padding: '1.1rem 1.25rem', textAlign: 'center' }}>
        <span style={{ fontSize: '11px', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.30)' }}>
          Created by{' '}
          <a href="https://ifergantech.vercel.app" target="_blank" rel="noopener noreferrer"
             style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none', borderBottom: '1px solid rgba(200,169,106,0.45)' }}>
            IferganTech
          </a>
        </span>
      </div>
    </footer>
  )
}
