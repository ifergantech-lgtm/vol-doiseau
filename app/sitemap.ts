import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'
import { LOCALES, DEFAULT_LOCALE, absoluteUrl } from '@/lib/seo'

// Refresh the sitemap hourly. Static pages are always included; dress pages are
// pulled live from Supabase so new listings appear automatically.
export const revalidate = 3600

// Public pages, expressed as the path AFTER the locale segment.
const STATIC_SUBPATHS = ['', '/collection', '/services', '/classes', '/contact'] as const

/** hreflang alternates for a given subpath, across every locale + x-default. */
function alternatesFor(subpath: string) {
  const languages: Record<string, string> = {}
  for (const locale of LOCALES) {
    languages[locale] = absoluteUrl(`/${locale}${subpath}`)
  }
  languages['x-default'] = absoluteUrl(`/${DEFAULT_LOCALE}${subpath}`)
  return { languages }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  console.log('[sitemap] generating sitemap')
  const entries: MetadataRoute.Sitemap = []
  const now = new Date()

  // 1) Static pages — one URL per locale, each annotated with its translations.
  for (const subpath of STATIC_SUBPATHS) {
    const isHome = subpath === ''
    for (const locale of LOCALES) {
      entries.push({
        url: absoluteUrl(`/${locale}${subpath}`),
        lastModified: now,
        changeFrequency: isHome ? 'weekly' : 'monthly',
        priority: isHome ? 1 : 0.8,
        alternates: alternatesFor(subpath),
      })
    }
  }

  // 2) Dress detail pages — read straight from Supabase (public, active only).
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (url && key) {
      const supabase = createClient(url, key)
      const { data: dresses, error } = await supabase
        .from('dresses')
        .select('slug, created_at, images')
        .eq('is_active', true)

      if (error) throw error

      for (const dress of dresses ?? []) {
        if (!dress.slug) continue
        const subpath = `/collection/${dress.slug}`
        const firstImage = (dress.images as string[] | null)?.[0]
        for (const locale of LOCALES) {
          entries.push({
            url: absoluteUrl(`/${locale}${subpath}`),
            lastModified: dress.created_at ? new Date(dress.created_at) : now,
            changeFrequency: 'monthly',
            priority: 0.7,
            alternates: alternatesFor(subpath),
            ...(firstImage ? { images: [firstImage] } : {}),
          })
        }
      }
    }
  } catch (err) {
    // A sitemap that lists static pages is far better than a 500 — degrade gracefully.
    console.error('[sitemap] could not load dresses from Supabase:', err)
  }

  console.log(`[sitemap] generated ${entries.length} URLs`)
  return entries
}
