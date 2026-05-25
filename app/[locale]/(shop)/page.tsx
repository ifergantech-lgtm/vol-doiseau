import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import DressCard from '@/components/DressCard'
import Reveal from '@/components/Reveal'
import HeroTitle from '@/components/HeroTitle'
import MagneticButton from '@/components/MagneticButton'
import Link from 'next/link'
import Image from 'next/image'
import type { Locale } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params
  const t = await getTranslations('home')
  const tn = await getTranslations('nav')
  const tc = await getTranslations('collection')
  const supabase = await createClient()

  const { data: featured } = await supabase
    .from('dresses')
    .select('*')
    .eq('is_featured', true)
    .eq('is_active', true)
    .limit(6)

  const services = [
    { key: 'sale', href: `/${locale}/collection` },
    { key: 'rental', href: `/${locale}/collection?availability=rental` },
    { key: 'custom', href: `/${locale}/services` },
    { key: 'classes', href: `/${locale}/classes` },
  ] as const

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <Image
          src="/shop/hero-storefront.jpg"
          alt="Vol D'Oiseau — King George 6, Tel Aviv"
          fill
          priority
          className="object-cover scale-105"
        />
        {/* Aurora orb — soft gold ambient drifting behind text */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none blur-3xl animate-aurora"
          style={{
            background:
              'radial-gradient(circle, rgba(232, 201, 122, 0.25) 0%, rgba(201, 168, 76, 0.1) 40%, transparent 70%)',
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/90 via-navy/80 to-navy" />

        <div className="relative z-10 text-center px-5 sm:px-6 max-w-3xl mx-auto">
          <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-gold/70 mb-5 sm:mb-6 animate-fade-in-down">
            Vol D&apos;Oiseau Paris
          </p>
          <HeroTitle
            text={t('hero_title')}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[0.12em] uppercase mb-5 sm:mb-6 leading-[1.05] gold-shimmer"
          />
          <p className="text-cream/60 text-sm sm:text-base tracking-wide mb-8 sm:mb-10 max-w-lg mx-auto leading-relaxed animate-fade-in-up delay-500">
            {t('hero_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in-up delay-700">
            <MagneticButton
              href={`/${locale}/collection`}
              className="btn-gold px-8 sm:px-10 py-4 text-xs tracking-widest uppercase font-medium text-navy-deep transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.4)] gold-gradient-bg"
            >
              {t('cta_collection')}
            </MagneticButton>
            <Link
              href={`/${locale}/contact`}
              className="px-8 sm:px-10 py-4 text-xs tracking-widest uppercase border border-gold/40 text-cream/80 hover:border-gold hover:text-gold hover:bg-gold/5 transition-all"
            >
              {t('cta_contact')}
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream/40 animate-fade-in delay-700">
          <span className="text-[9px] tracking-[0.4em] uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-gold/60 to-transparent animate-scroll-bounce" />
        </div>
      </section>

      {/* Featured dresses */}
      {featured && featured.length > 0 && (
        <section className="py-16 sm:py-24 px-5 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <div className="text-center mb-12 sm:mb-16">
                <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-gold/60 mb-3">— {tn('collection')} —</p>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-[0.12em] uppercase text-cream">
                  {t('featured_title')}
                </h2>
                <span className="gold-divider mt-6" />
              </div>
            </Reveal>
            <Reveal stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {featured.map((dress) => (
                <DressCard
                  key={dress.id}
                  dress={dress}
                  locale={locale as Locale}
                  availabilityLabels={{
                    sale: tc('sale_label'),
                    rental: tc('rental_label'),
                    both: tc('both_label'),
                  }}
                />
              ))}
            </Reveal>
            <Reveal>
              <div className="text-center mt-12 sm:mt-14">
                <Link
                  href={`/${locale}/collection`}
                  className="inline-block px-8 sm:px-10 py-4 text-xs tracking-widest uppercase border border-gold/40 text-gold hover:bg-gold/10 hover:border-gold transition-all"
                >
                  {t('cta_collection')} →
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Services */}
      <section className="py-16 sm:py-24 px-5 sm:px-6 bg-navy-deep relative overflow-hidden">
        {/* Subtle gold accent line at top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-12 sm:mb-16">
              <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-gold/60 mb-3">— Maison —</p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-[0.12em] uppercase text-cream">
                {t('services_title')}
              </h2>
              <span className="gold-divider mt-6" />
            </div>
          </Reveal>
          <Reveal stagger className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {services.map(({ key, href }, idx) => (
              <Link
                key={key}
                href={href}
                className="group relative border border-gold/10 hover:border-gold/40 p-6 sm:p-8 text-center transition-all duration-500 hover:bg-gold/5 hover:-translate-y-1 overflow-hidden min-h-[180px] sm:min-h-[200px] flex flex-col justify-center"
              >
                <span className="block text-[10px] sm:text-[11px] tracking-[0.4em] uppercase text-gold/40 mb-3 group-hover:text-gold transition-colors">
                  0{idx + 1}
                </span>
                <h3 className="font-display text-base sm:text-lg md:text-xl tracking-wide text-cream mb-2 group-hover:text-gold transition-colors">
                  {t(`service_${key}`)}
                </h3>
                <p className="text-[11px] sm:text-xs text-cream/40 leading-relaxed">
                  {t(`service_${key}_desc`)}
                </p>
                <span className="absolute bottom-0 left-0 h-px w-0 bg-gold group-hover:w-full transition-all duration-500" />
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* About Elisheva — with real boutique interior */}
      <section className="py-16 sm:py-24 px-5 sm:px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 sm:gap-12 md:gap-16 items-center">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-gold/15 group">
              <Image
                src="/shop/interior-1.jpg"
                alt="Vol D'Oiseau boutique interior — King George 6, Tel Aviv"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/40 via-transparent to-transparent" />
            </div>
          </Reveal>
          <Reveal>
            <div>
              <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-gold/60 mb-4">— {t('about_title')} —</p>
              <p className="text-cream/65 leading-relaxed text-sm sm:text-base md:text-lg font-display italic">
                {t('about_body')}
              </p>
              <span className="gold-divider wide mt-8" style={{ marginLeft: 0, marginRight: 'auto' }} />
              <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-gold/50 mt-6">
                King George 6 · Tel Aviv
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-14 sm:py-16 px-5 sm:px-6 border-t border-gold/10 text-center">
        <Reveal>
          <MagneticButton
            href={`/${locale}/contact`}
            className="btn-gold px-10 sm:px-12 py-4 text-xs tracking-widest uppercase font-medium text-navy-deep transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.4)] gold-gradient-bg"
          >
            {t('footer_cta')}
          </MagneticButton>
        </Reveal>
      </section>
    </>
  )
}
