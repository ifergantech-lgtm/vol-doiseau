import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import Reveal from '@/components/Reveal'
import HeroSection from '@/components/HeroSection'
import AmbientGlow from '@/components/AmbientGlow'
import MagneticButton from '@/components/MagneticButton'
import ServicesCarousel from '@/components/ServicesCarousel'
import Image from 'next/image'
import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import JsonLd from '@/components/JsonLd'
import { localBusinessSchema, websiteSchema } from '@/lib/schema'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo.home' })
  return pageMetadata({
    locale,
    subpath: '',
    title: t('title'),
    description: t('description'),
    absoluteTitle: true,
  })
}

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params
  const t = await getTranslations('home')
  const tSeo = await getTranslations({ locale, namespace: 'seo.home' })
  const supabase = await createClient()

  const { data: featured } = await supabase
    .from('dresses')
    .select('*')
    .eq('is_featured', true)
    .eq('is_active', true)
    .limit(6)

  // Hero carousel = the featured dresses' photos. If nothing is featured yet,
  // fall back to any active dress so the hero is never empty.
  const featuredImages = (featured || [])
    .map(d => (d.images as string[] | null)?.[0])
    .filter((url): url is string => Boolean(url))

  let carouselImages = featuredImages
  if (carouselImages.length === 0) {
    const { data: carouselDresses } = await supabase
      .from('dresses')
      .select('images')
      .eq('is_active', true)
      .limit(10)
    carouselImages = (carouselDresses || [])
      .map(d => (d.images as string[] | null)?.[0])
      .filter((url): url is string => Boolean(url))
      .slice(0, 8)
  }

  const services = [
    { key: 'sale', href: `/${locale}/collection`, img: '/shop/interior/studio-rack.jpg' },
    { key: 'rental', href: `/${locale}/collection?availability=rental`, img: '/shop/hero-storefront.jpg' },
    { key: 'custom', href: `/${locale}/services`, img: '/atelier/dressmaking.png' },
    { key: 'classes', href: `/${locale}/classes`, img: '/shop/interior/studio-singer.jpg' },
  ] as const

  const serviceItems = services.map(({ key, href, img }, idx) => ({
    href,
    img,
    num: String(idx + 1).padStart(2, '0'),
    title: t(`service_${key}`),
    desc: t(`service_${key}_desc`),
  }))

  const discoverLabels: Record<string, string> = {
    en: 'Discover', fr: 'Découvrir', es: 'Descubrir', pt: 'Descobrir',
    it: 'Scopri', ru: 'Открыть', he: 'לגלות', ar: 'اكتشفوا',
  }
  const discoverLabel = discoverLabels[locale] ?? 'Discover'

  return (
    <>
      <JsonLd data={[localBusinessSchema({ description: tSeo('description') }), websiteSchema(locale)]} />
      {/* Hero */}
      <HeroSection
        locale={locale}
        heroTitle={t('hero_title')}
        heroSubtitle={t('hero_subtitle')}
        ctaCollection={t('cta_collection')}
        ctaContact={t('cta_contact')}
        carouselImages={carouselImages}
      />

      {/* Services */}
      <section className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-navy-deep border-t border-gold/10 overflow-hidden">
        <AmbientGlow density="rich" orb="bottom-left" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <Reveal>
            <div className="mb-12 sm:mb-16 md:mb-24">
              <div className="space-y-2 sm:space-y-3 md:space-y-4 mb-4 sm:mb-6 md:mb-8">
                <p className="text-[9px] sm:text-xs tracking-[0.4em] uppercase text-gold/50">— Maison —</p>
                <h2 className="font-display text-xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[0.08em] text-cream leading-[1.3] sm:leading-[1.2]">
                  {t('services_title').split(' ').slice(0, 1).join(' ')}
                  <span className="gold-shimmer italic block sm:inline"> {t('services_title').split(' ').slice(1).join(' ')}</span>
                </h2>
              </div>
              <div className="w-10 sm:w-12 h-px bg-gradient-to-r from-gold to-transparent" />
            </div>
          </Reveal>

          <Reveal>
            <ServicesCarousel items={serviceItems} discoverLabel={discoverLabel} />
          </Reveal>
        </div>
      </section>

      {/* About Elisheva — with real boutique interior */}
      <section className="relative overflow-hidden py-12 sm:py-16 md:py-24 px-4 sm:px-6">
        <AmbientGlow density="light" orb="top-left" />
        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 items-center">
          <Reveal variant="zoom">
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-gold/15 group">
              <Image
                src="/shop/hero-storefront.jpg"
                alt="Vol D'Oiseau boutique — King George 6, Tel Aviv"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/40 via-transparent to-transparent" />
            </div>
          </Reveal>
          <Reveal>
            <div>
              <p className="text-[9px] sm:text-xs tracking-[0.4em] uppercase text-gold/60 mb-3 sm:mb-4">— {t('about_title')} —</p>
              <p className="text-cream/65 leading-relaxed text-sm sm:text-base md:text-lg font-display italic">
                {t('about_body')}
              </p>
              <span className="gold-divider wide mt-6 sm:mt-8" style={{ marginLeft: 0, marginRight: 'auto' }} />
              <p className="text-[9px] sm:text-xs tracking-[0.4em] uppercase text-gold/50 mt-4 sm:mt-6">
                King George 6 · Tel Aviv
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 border-t border-gold/10 text-center">
        <Reveal>
          <MagneticButton
            href={`/${locale}/contact`}
            className="btn-gold breathe-glow px-6 sm:px-8 md:px-12 py-3 sm:py-3 md:py-4 text-[10px] sm:text-xs tracking-widest uppercase font-medium text-navy-deep transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.4)] gold-gradient-bg h-11 sm:h-auto md:min-h-[44px] inline-flex items-center justify-center rounded-sm"
          >
            {t('footer_cta')}
          </MagneticButton>
        </Reveal>
      </section>
    </>
  )
}
