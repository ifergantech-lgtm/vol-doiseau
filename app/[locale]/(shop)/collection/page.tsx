import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import CollectionClient from './CollectionClient'
import Image from 'next/image'
import type { Locale } from '@/lib/utils'
import type { Metadata } from 'next'
import { pageMetadata, absoluteUrl } from '@/lib/seo'
import JsonLd from '@/components/JsonLd'
import { breadcrumbSchema } from '@/lib/schema'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: PageProps<'/[locale]/collection'>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo.collection' })
  return pageMetadata({
    locale,
    subpath: '/collection',
    title: t('title'),
    description: t('description'),
  })
}

export default async function CollectionPage({ params }: PageProps<'/[locale]/collection'>) {
  const { locale } = await params
  const t = await getTranslations('collection')
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const supabase = await createClient()

  const { data: dresses } = await supabase
    .from('dresses')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (
    <div className="pt-20">
      <JsonLd
        data={breadcrumbSchema([
          { name: tNav('home'), url: absoluteUrl(`/${locale}`) },
          { name: tNav('collection'), url: absoluteUrl(`/${locale}/collection`) },
        ])}
      />
      <section className="relative py-16 sm:py-20 md:py-28 px-5 sm:px-6 border-b border-gold/10 animate-fade-in-down overflow-hidden">
        <Image
          src="/shop/interior/elisheva-at-work.jpg"
          alt="Vol D'Oiseau atelier"
          fill
          priority
          className="object-cover object-[center_20%] opacity-[0.18]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/80 to-navy-deep" />
        {/* Aurora orbs */}
        <div className="absolute top-[8%] right-[12%] w-[280px] h-[280px] rounded-full pointer-events-none animate-aurora" style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.18) 0%, transparent 70%)', filter: 'blur(70px)' }} />
        <div className="absolute bottom-[5%] left-[8%] w-[180px] h-[180px] rounded-full pointer-events-none animate-aurora" style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.10) 0%, transparent 70%)', filter: 'blur(50px)', animationDelay: '-7s' }} />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
            <div className="space-y-3 sm:space-y-4">
              <p className="text-[11px] sm:text-xs tracking-[0.4em] uppercase text-gold/50">Vol D&apos;Oiseau</p>
              <div className="w-12 h-px bg-gradient-to-r from-gold to-transparent" />
            </div>
            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[0.08em] text-cream leading-[1.2] sm:leading-[1.1]">
              {t('title').split(' ').slice(0, 1).join(' ')}
              <span className="gold-shimmer italic block sm:inline"> {t('title').split(' ').slice(1).join(' ')}</span>
            </h1>
          </div>
          <p className="text-cream/60 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl font-light">
            {t('subtitle')}
          </p>
        </div>
      </section>

      <CollectionClient
        dresses={dresses || []}
        locale={locale as Locale}
        labels={{
          all: t('filter_all'),
          evening: t('filter_evening'),
          wedding: t('filter_wedding'),
          sale: t('filter_sale'),
          rental: t('filter_rental'),
          empty: t('empty'),
          saleLabel: t('sale_label'),
          rentalLabel: t('rental_label'),
          bothLabel: t('both_label'),
        }}
      />
    </div>
  )
}
