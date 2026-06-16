import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'

/**
 * Central SEO configuration and helpers.
 * Reused by sitemap.ts, robots.ts, manifest.ts, the root layout, per-page
 * generateMetadata, and the structured-data (JSON-LD) components.
 */

/** Canonical production origin, no trailing slash. Override with NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://vol-doiseau.vercel.app'
).replace(/\/+$/, '')

export const LOCALES = routing.locales
export const DEFAULT_LOCALE = routing.defaultLocale

/** Locales that read right-to-left. */
const RTL_LOCALES = new Set<string>(['he', 'ar'])

export function getDirection(locale: string): 'rtl' | 'ltr' {
  return RTL_LOCALES.has(locale) ? 'rtl' : 'ltr'
}

/** Map an app locale to its Open Graph locale code (og:locale). */
const OG_LOCALES: Record<string, string> = {
  he: 'he_IL',
  fr: 'fr_FR',
  en: 'en_US',
  es: 'es_ES',
  it: 'it_IT',
  ru: 'ru_RU',
  ar: 'ar_AR',
  pt: 'pt_PT',
}

export function ogLocale(locale: string): string {
  return OG_LOCALES[locale] ?? 'en_US'
}

/** Build an absolute URL from a root-relative path. */
export function absoluteUrl(path = ''): string {
  if (!path) return SITE_URL
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

/**
 * Build canonical + hreflang language alternates for a localized route.
 * `subpath` is everything after the locale segment — '' for the home page,
 * '/collection' for the collection, '/collection/<slug>' for a dress, etc.
 */
export function localeAlternates(locale: string, subpath = '') {
  const clean = subpath && !subpath.startsWith('/') ? `/${subpath}` : subpath
  const languages: Record<string, string> = {}
  for (const l of LOCALES) {
    languages[l] = absoluteUrl(`/${l}${clean}`)
  }
  // x-default tells Google which version to show when no language matches.
  languages['x-default'] = absoluteUrl(`/${DEFAULT_LOCALE}${clean}`)

  return {
    canonical: absoluteUrl(`/${locale}${clean}`),
    languages,
  }
}

/**
 * Boutique facts, kept in one place so metadata and structured data never
 * drift apart. Opening hours and pricing are intentionally omitted until the
 * owner confirms them — we don't assert facts we can't verify.
 */
export const BUSINESS = {
  name: "Vol D'Oiseau",
  legalName: "Vol D'Oiseau Paris",
  phone: '+972502290718',
  phoneDisplay: '050-229-0718',
  whatsapp: '+33781721617',
  street: 'King George 6',
  city: 'Tel Aviv',
  region: 'Tel Aviv District',
  postalCountry: 'IL',
  instagram: 'https://www.instagram.com/voldoiseauparis',
} as const

/** Default social-share image — the boutique storefront. */
export const DEFAULT_OG_IMAGE = '/shop/hero-storefront.jpg'

/** Collapse whitespace and clamp a string for use as a meta description. */
export function truncate(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}…`
}

/**
 * Shared metadata builder for localized pages: sets the title, description,
 * canonical URL, hreflang alternates, and Open Graph fields in one place.
 */
export function pageMetadata(opts: {
  locale: string
  subpath: string
  title: string
  description: string
  absoluteTitle?: boolean
  image?: string
}): Metadata {
  const { locale, subpath, title, description, absoluteTitle, image } = opts
  const alternates = localeAlternates(locale, subpath)
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      locale: ogLocale(locale),
      type: 'website',
      ...(image ? { images: [{ url: image }] } : {}),
    },
  }
}
