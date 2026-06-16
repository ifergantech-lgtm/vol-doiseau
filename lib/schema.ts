import { SITE_URL, BUSINESS, LOCALES, absoluteUrl, DEFAULT_OG_IMAGE } from '@/lib/seo'

/**
 * schema.org (JSON-LD) builders. Every value comes from real site data — we
 * never invent ratings, prices, or opening hours. Offers are only emitted when
 * a price actually exists.
 */

type Json = Record<string, unknown>

const BUSINESS_ID = `${SITE_URL}/#business`
const WEBSITE_ID = `${SITE_URL}/#website`

/** The boutique as a local business (a clothing store). */
export function localBusinessSchema(opts?: { description?: string }): Json {
  const schema: Json = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    '@id': BUSINESS_ID,
    name: BUSINESS.name,
    alternateName: BUSINESS.legalName,
    url: SITE_URL,
    logo: absoluteUrl('/logo-bird.png'),
    image: [absoluteUrl(DEFAULT_OG_IMAGE)],
    telephone: BUSINESS.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.street,
      addressLocality: BUSINESS.city,
      addressRegion: BUSINESS.region,
      addressCountry: BUSINESS.postalCountry,
    },
    areaServed: { '@type': 'City', name: BUSINESS.city },
    knowsLanguage: [...LOCALES],
    currenciesAccepted: 'ILS',
    sameAs: [BUSINESS.instagram],
  }
  if (opts?.description) schema.description = opts.description
  return schema
}

/** The website entity, linked to the business as publisher. */
export function websiteSchema(locale: string): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: BUSINESS.name,
    inLanguage: locale,
    publisher: { '@id': BUSINESS_ID },
  }
}

/** Breadcrumb trail for a page. Pass absolute URLs. */
export function breadcrumbSchema(items: { name: string; url: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/** A dress as a Product. Offers appear only for prices that are set. */
export function productSchema(opts: {
  name: string
  url: string
  description?: string
  images?: (string | null | undefined)[]
  category?: string
  priceSale?: number | null
  priceRental?: number | null
}): Json {
  const { name, url, description, images, category, priceSale, priceRental } = opts

  const offers: Json[] = []
  if (priceSale != null) {
    offers.push({
      '@type': 'Offer',
      priceCurrency: 'ILS',
      price: priceSale,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      businessFunction: 'http://purl.org/goodrelations/v1#Sell',
      url,
    })
  }
  if (priceRental != null) {
    offers.push({
      '@type': 'Offer',
      priceCurrency: 'ILS',
      price: priceRental,
      availability: 'https://schema.org/InStock',
      businessFunction: 'http://purl.org/goodrelations/v1#LeaseOut',
      url,
    })
  }

  const validImages = (images ?? []).filter(
    (u): u is string => typeof u === 'string' && u.startsWith('http')
  )

  const schema: Json = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    url,
    brand: { '@type': 'Brand', name: BUSINESS.name },
  }
  if (description) schema.description = description
  if (validImages.length) schema.image = validImages
  if (category) schema.category = category
  if (offers.length) schema.offers = offers.length === 1 ? offers[0] : offers
  return schema
}

/** A sewing class as a Course, provided by the boutique. */
export function courseSchema(opts: { name: string; description: string; url: string }): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    provider: {
      '@type': 'Organization',
      name: BUSINESS.name,
      url: SITE_URL,
    },
  }
}
