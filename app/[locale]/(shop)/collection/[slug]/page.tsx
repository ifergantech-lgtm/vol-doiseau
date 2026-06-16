import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import DressGallery from '@/components/DressGallery'
import DressCard from '@/components/DressCard'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { formatPrice, getLocalizedText, getWhatsAppUrl, type Locale } from '@/lib/utils'
import type { Metadata } from 'next'
import { pageMetadata, truncate, absoluteUrl } from '@/lib/seo'
import JsonLd from '@/components/JsonLd'
import { productSchema, breadcrumbSchema } from '@/lib/schema'

// Always fetch fresh from Supabase, no static caching
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: PageProps<'/[locale]/collection/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params
  const subpath = `/collection/${slug}`
  const supabase = await createClient()
  const { data: dress } = await supabase
    .from('dresses')
    .select('title, description, category, images')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  const tSeo = await getTranslations({ locale, namespace: 'seo.collection' })
  if (!dress) {
    return pageMetadata({ locale, subpath, title: tSeo('title'), description: tSeo('description') })
  }

  const tDress = await getTranslations({ locale, namespace: 'dress' })
  const title = getLocalizedText(dress.title, locale as Locale)
  const rawDescription = getLocalizedText(dress.description, locale as Locale)
  const categoryLabel = tDress(`category_${dress.category}` as 'category_evening' | 'category_wedding')
  const firstImage = (dress.images as string[] | null)?.[0]

  return pageMetadata({
    locale,
    subpath,
    title: `${title} — ${categoryLabel}`,
    description: truncate(rawDescription || tSeo('description')),
    image: firstImage && firstImage.startsWith('http') ? firstImage : undefined,
  })
}

export default async function DressPage({ params }: PageProps<'/[locale]/collection/[slug]'>) {
  const { locale, slug } = await params
  const t = await getTranslations('dress')
  const tNav = await getTranslations({ locale, namespace: 'nav' })

  const supabase = await createClient()
  const { data: dress } = await supabase
    .from('dresses')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!dress) notFound()

  const title = getLocalizedText(dress.title, locale as Locale)
  const description = getLocalizedText(dress.description, locale as Locale)
  const whatsappUrl = getWhatsAppUrl(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '33781721617')

  const categoryLabel = t(`category_${dress.category}` as 'category_evening' | 'category_wedding')

  // Related dresses in the same category — interlinks product pages (no dead ends).
  const tCol = await getTranslations('collection')
  const { data: relatedRaw } = await supabase
    .from('dresses')
    .select('id, slug, title, category, availability, price_sale, price_rental, images')
    .eq('is_active', true)
    .eq('category', dress.category)
    .neq('id', dress.id)
    .limit(4)
  const related = relatedRaw || []

  return (
    <div className="pt-20">
      <JsonLd
        data={[
          productSchema({
            name: title,
            url: absoluteUrl(`/${locale}/collection/${dress.slug}`),
            description: description || undefined,
            images: dress.images,
            category: categoryLabel,
            priceSale: dress.price_sale,
            priceRental: dress.price_rental,
          }),
          breadcrumbSchema([
            { name: tNav('home'), url: absoluteUrl(`/${locale}`) },
            { name: tNav('collection'), url: absoluteUrl(`/${locale}/collection`) },
            { name: title, url: absoluteUrl(`/${locale}/collection/${dress.slug}`) },
          ]),
        ]}
      />
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[10px] tracking-widest uppercase text-cream/40 mb-12">
          <Link href={`/${locale}`} className="hover:text-gold transition-colors">{tNav('home')}</Link>
          <span className="text-cream/25">/</span>
          <Link href={`/${locale}/collection`} className="hover:text-gold transition-colors">{tNav('collection')}</Link>
          <span className="text-cream/25">/</span>
          <span className="text-cream/70 normal-case tracking-normal">{title}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Gallery */}
          <DressGallery images={dress.images} slug={dress.slug} title={title} />

          {/* Details */}
          <div className="flex flex-col gap-8">
            <div>
              <span className="text-[10px] tracking-[0.4em] uppercase text-gold/60 block mb-2">
                {categoryLabel}
              </span>
              <h1 className="font-display text-3xl md:text-4xl tracking-[0.12em] uppercase text-cream mb-4">
                {title}
              </h1>
              <div className="w-12 h-px bg-gold/30 mb-6" />
              {description && (
                <p className="text-cream/60 leading-relaxed text-sm">{description}</p>
              )}
            </div>

            {/* Pricing */}
            <div className="border border-gold/10 p-6 space-y-3">
              {dress.price_sale != null && (dress.availability === 'sale' || dress.availability === 'both') && (
                <div className="flex justify-between items-center">
                  <span className="text-xs tracking-widest uppercase text-cream/40">{t('sale_price')}</span>
                  <span className="font-display text-lg text-cream">{formatPrice(dress.price_sale)}</span>
                </div>
              )}
              {dress.price_rental != null && (dress.availability === 'rental' || dress.availability === 'both') && (
                <div className="flex justify-between items-center">
                  <span className="text-xs tracking-widest uppercase text-cream/40">{t('rental_price')}</span>
                  <span className="font-display text-lg text-gold">{formatPrice(dress.price_rental)}</span>
                </div>
              )}
            </div>

            {/* WhatsApp CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 py-4 text-xs tracking-widest uppercase font-medium text-navy-deep transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #b8860b, #c9a84c, #e8c97a, #c9a84c)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t('whatsapp')}
            </a>

            {/* Call — Israeli number */}
            <a
              href="tel:+972502290718"
              className="flex items-center justify-center gap-3 py-4 text-xs tracking-widest uppercase border border-gold/40 text-gold hover:bg-gold/10 hover:border-gold transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              050-229-0718
            </a>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20 pt-12 border-t border-gold/10">
            <h2 className="font-display text-xl sm:text-2xl tracking-[0.08em] text-cream mb-8">
              {t('related')}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {related.map((d) => (
                <DressCard
                  key={d.id}
                  dress={d}
                  locale={locale as Locale}
                  availabilityLabels={{ sale: tCol('sale_label'), rental: tCol('rental_label'), both: tCol('both_label') }}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
