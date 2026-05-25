import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import CollectionClient from './CollectionClient'
import type { Locale } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function CollectionPage({ params }: PageProps<'/[locale]/collection'>) {
  const { locale } = await params
  const t = await getTranslations('collection')
  const supabase = await createClient()

  const { data: dresses } = await supabase
    .from('dresses')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (
    <div className="pt-20">
      <section className="py-16 sm:py-20 px-5 sm:px-6 text-center border-b border-gold/10 animate-fade-in-down">
        <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-gold/60 mb-4">Vol D&apos;Oiseau</p>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-[0.12em] uppercase text-cream mb-4">
          {t('title')}
        </h1>
        <p className="text-cream/55 text-sm tracking-wide max-w-xl mx-auto leading-relaxed">{t('subtitle')}</p>
        <div className="mt-6 w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto" />
      </section>

      <CollectionClient
        dresses={dresses || []}
        locale={locale as Locale}
        labels={{
          all: t('filter_all'),
          evening: t('filter_evening'),
          wedding: t('filter_wedding'),
          cocktail: t('filter_cocktail'),
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
