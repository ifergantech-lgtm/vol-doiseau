import { useTranslations } from 'next-intl'

export default function Footer() {
  const t = useTranslations('footer')
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-gold/20 bg-navy-deep py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-start">
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
        <div className="text-xs text-cream/40 tracking-wide space-y-1">
          <p>{t('address')}</p>
          <p>050-229-0718</p>
          <p>© {year} Vol D&apos;Oiseau. {t('rights')}.</p>
        </div>
      </div>
    </footer>
  )
}
