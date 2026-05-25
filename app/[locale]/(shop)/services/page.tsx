import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import Reveal from '@/components/Reveal'
import MagneticButton from '@/components/MagneticButton'

export default async function ServicesPage({ params }: PageProps<'/[locale]/services'>) {
  const { locale } = await params
  const t = await getTranslations('services')

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="relative py-20 sm:py-24 md:py-28 px-5 sm:px-6 overflow-hidden">
        <Image
          src="/atelier/dressmaking.png"
          alt="Atelier"
          fill
          className="object-cover opacity-25"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy/85 to-navy" />
        <div className="relative z-10 text-center max-w-2xl mx-auto animate-fade-in-down">
          <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-gold/60 mb-4">Vol D&apos;Oiseau</p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-[0.12em] uppercase text-cream mb-4">
            {t('title')}
          </h1>
          <p className="text-cream/55 text-sm sm:text-base tracking-wide max-w-xl mx-auto leading-relaxed">{t('subtitle')}</p>
          <div className="mt-6 w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto" />
        </div>
      </section>

      {/* Custom dressmaking */}
      <section className="py-16 sm:py-24 px-5 sm:px-6">
        <Reveal>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 sm:gap-12 md:gap-16 items-center">
            <div className="relative aspect-[3/4] rounded-sm overflow-hidden border border-gold/10 group hover:border-gold/30 transition-colors duration-500">
              <Image
                src="/atelier/dressmaking.png"
                alt={t('dressmaking_title')}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/40 via-transparent to-transparent" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-gold/60 mb-3">01 — {t('dressmaking_lead')}</p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-[0.12em] uppercase text-cream mb-6">
                {t('dressmaking_title')}
              </h2>
              <span className="gold-divider mb-6 mx-0 sm:mx-0" style={{ marginLeft: 0, marginRight: 'auto' }} />
              <p className="text-cream/65 leading-relaxed text-sm sm:text-base mb-6">
                {t('dressmaking_body')}
              </p>
              <p className="text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-gold/50 mb-8">
                {t('dressmaking_steps')}
              </p>
              <Link
                href={`/${locale}/contact`}
                className="inline-block px-8 py-3.5 text-xs tracking-widest uppercase border border-gold/40 text-gold hover:bg-gold/10 hover:border-gold transition-all"
              >
                {t('book_cta')}
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Alterations */}
      <section className="py-16 sm:py-24 px-5 sm:px-6 bg-navy-deep">
        <Reveal>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 sm:gap-12 md:gap-16 items-center">
            <div className="md:order-2 relative aspect-[3/4] rounded-sm overflow-hidden border border-gold/10 group hover:border-gold/30 transition-colors duration-500">
              <Image
                src="/atelier/alterations.png"
                alt={t('alterations_title')}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/40 via-transparent to-transparent" />
            </div>
            <div className="md:order-1">
              <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-gold/60 mb-3">02 — {t('alterations_lead')}</p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-[0.12em] uppercase text-cream mb-6">
                {t('alterations_title')}
              </h2>
              <span className="gold-divider mb-6" style={{ marginLeft: 0, marginRight: 'auto' }} />
              <p className="text-cream/65 leading-relaxed text-sm sm:text-base mb-6">
                {t('alterations_body')}
              </p>
              <p className="text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-gold/50 mb-8">
                {t('alterations_steps')}
              </p>
              <Link
                href={`/${locale}/contact`}
                className="inline-block px-8 py-3.5 text-xs tracking-widest uppercase border border-gold/40 text-gold hover:bg-gold/10 hover:border-gold transition-all"
              >
                {t('book_cta')}
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Contact CTA */}
      <section className="py-16 sm:py-20 px-5 sm:px-6 text-center border-t border-gold/10">
        <Reveal>
          <MagneticButton
            href={`/${locale}/contact`}
            className="btn-gold px-10 sm:px-12 py-4 text-xs tracking-widest uppercase font-medium text-navy-deep hover:shadow-[0_0_30px_rgba(201,168,76,0.4)] transition-all gold-gradient-bg"
          >
            {t('book_cta')}
          </MagneticButton>
        </Reveal>
      </section>
    </div>
  )
}
