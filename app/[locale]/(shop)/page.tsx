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
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20 bg-navy">
        {/* Background layer */}
        <div className="absolute inset-0 bg-navy" />

        {/* Subtle glow */}
        <div
          className="absolute top-1/4 left-1/4 w-[800px] h-[800px] rounded-full pointer-events-none blur-3xl opacity-30"
          style={{
            background:
              'radial-gradient(circle, rgba(201, 168, 76, 0.15) 0%, transparent 70%)',
          }}
          aria-hidden
        />

        {/* Content grid */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 py-12 md:py-0">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center">
            {/* Left: Text content */}
            <Reveal>
              <div className="space-y-6 sm:space-y-8">
                <div className="space-y-3 sm:space-y-4">
                  <p className="text-[11px] sm:text-xs tracking-[0.4em] uppercase text-gold/60 animate-fade-in-down">
                    Vol D&apos;Oiseau — Paris
                  </p>
                  <div className="w-12 h-px bg-gradient-to-r from-gold to-transparent" />
                </div>

                <div className="space-y-5 sm:space-y-6">
                  <h1 className="font-display text-3xl sm:text-5xl md:text-5xl lg:text-6xl tracking-[0.08em] leading-[1.2] sm:leading-[1.1] text-cream">
                    <span>{t('hero_title').split(' ').slice(0, -1).join(' ')}</span>
                    <br />
                    <span className="text-gold italic">{t('hero_title').split(' ').slice(-1)}</span>
                  </h1>
                </div>

                <p className="text-cream/65 text-sm sm:text-base leading-relaxed max-w-md font-light">
                  {t('hero_subtitle')}
                </p>

                <div className="pt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <MagneticButton
                    href={`/${locale}/collection`}
                    className="btn-gold px-8 py-3 sm:py-4 text-xs tracking-widest uppercase font-medium text-navy-deep transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.4)] gold-gradient-bg min-h-[44px] flex items-center justify-center"
                  >
                    {t('cta_collection')} →
                  </MagneticButton>
                  <Link
                    href={`/${locale}/contact`}
                    className="px-8 py-3 sm:py-4 text-xs tracking-widest uppercase border border-gold/40 text-cream/70 hover:border-gold hover:text-gold transition-all text-center min-h-[44px] flex items-center justify-center"
                  >
                    {t('cta_contact')}
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Right: Hero image */}
            <Reveal>
              <div className="relative h-[500px] md:h-[600px] hidden md:block">
                <Image
                  src="/shop/hero-storefront.jpg"
                  alt="Vol D'Oiseau — King George 6, Tel Aviv"
                  fill
                  priority
                  className="object-cover rounded-sm border border-gold/20 hover:border-gold/50 transition-colors duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-40 rounded-sm" />
              </div>
            </Reveal>
          </div>
        </div>

        {/* Mobile hero image */}
        <div className="md:hidden absolute inset-0 z-0">
          <Image
            src="/shop/hero-storefront.jpg"
            alt="Vol D'Oiseau — King George 6, Tel Aviv"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/85 via-navy/70 to-navy" />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream/40 animate-fade-in delay-700 z-20">
          <span className="text-[9px] tracking-[0.4em] uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-gold/60 to-transparent animate-scroll-bounce" />
        </div>
      </section>

      {/* Featured dresses */}
      {featured && featured.length > 0 && (
        <section className="py-24 sm:py-32 px-5 sm:px-6 bg-gradient-to-b from-navy via-navy/95 to-navy border-t border-gold/10">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <div className="mb-16 sm:mb-20">
                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  <p className="text-[11px] sm:text-xs tracking-[0.4em] uppercase text-gold/50">— {tn('collection')} —</p>
                  <h2 className="font-display text-3xl sm:text-5xl md:text-6xl tracking-[0.08em] text-cream leading-[1.2]">
                    {t('featured_title').split(' ').slice(0, 1).join(' ')}
                    <span className="text-gold italic block sm:inline"> {t('featured_title').split(' ').slice(1).join(' ')}</span>
                  </h2>
                </div>
                <div className="w-12 h-px bg-gradient-to-r from-gold to-transparent" />
              </div>
            </Reveal>

            <Reveal stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20">
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
              <div className="text-left">
                <Link
                  href={`/${locale}/collection`}
                  className="inline-flex items-center px-8 py-3 sm:py-4 text-xs tracking-widest uppercase border border-gold/40 text-cream/70 hover:text-gold hover:border-gold transition-all group min-h-[44px]"
                >
                  <span>{t('cta_collection')}</span>
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Services */}
      <section className="py-24 sm:py-32 px-5 sm:px-6 bg-navy-deep border-t border-gold/10 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="mb-16 sm:mb-24">
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <p className="text-[11px] sm:text-xs tracking-[0.4em] uppercase text-gold/50">— Maison —</p>
                <h2 className="font-display text-3xl sm:text-5xl md:text-6xl tracking-[0.08em] text-cream leading-[1.2]">
                  {t('services_title').split(' ').slice(0, 1).join(' ')}
                  <span className="text-gold italic block sm:inline"> {t('services_title').split(' ').slice(1).join(' ')}</span>
                </h2>
              </div>
              <div className="w-12 h-px bg-gradient-to-r from-gold to-transparent" />
            </div>
          </Reveal>

          <Reveal stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {services.map(({ key, href }, idx) => (
              <Link
                key={key}
                href={href}
                className="group relative border border-gold/15 hover:border-gold/50 p-8 sm:p-10 flex flex-col transition-all duration-500 hover:bg-gold/5 hover:-translate-y-1 overflow-hidden"
              >
                <span className="block text-[10px] tracking-[0.4em] uppercase text-gold/40 mb-6 group-hover:text-gold transition-colors font-light">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-lg sm:text-xl tracking-[0.05em] text-cream mb-4 group-hover:text-gold transition-colors leading-tight">
                  {t(`service_${key}`)}
                </h3>
                <p className="text-xs sm:text-sm text-cream/50 leading-relaxed flex-grow">
                  {t(`service_${key}_desc`)}
                </p>
                <div className="w-8 h-px bg-gold/30 mt-6 group-hover:w-12 group-hover:bg-gold transition-all duration-500" />
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
                src="/shop/exterior-1.jpg"
                alt="Vol D'Oiseau boutique storefront — King George 6, Tel Aviv"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/40 via-transparent to-transparent" />
            </div>
          </Reveal>
          <Reveal>
            <div>
              <p className="text-[11px] sm:text-xs tracking-[0.4em] uppercase text-gold/60 mb-4">— {t('about_title')} —</p>
              <p className="text-cream/65 leading-relaxed text-base sm:text-base md:text-lg font-display italic">
                {t('about_body')}
              </p>
              <span className="gold-divider wide mt-8" style={{ marginLeft: 0, marginRight: 'auto' }} />
              <p className="text-[11px] sm:text-xs tracking-[0.4em] uppercase text-gold/50 mt-6">
                King George 6 · Tel Aviv
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 sm:py-20 px-5 sm:px-6 border-t border-gold/10 text-center">
        <Reveal>
          <MagneticButton
            href={`/${locale}/contact`}
            className="btn-gold px-8 sm:px-12 py-3 sm:py-4 text-xs tracking-widest uppercase font-medium text-navy-deep transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.4)] gold-gradient-bg min-h-[44px] inline-flex items-center justify-center"
          >
            {t('footer_cta')}
          </MagneticButton>
        </Reveal>
      </section>
    </>
  )
}
