import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { SITE_URL, getDirection, DEFAULT_OG_IMAGE } from '@/lib/seo'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Vol D'Oiseau — Boutique de robes de soirée & mariée, Tel Aviv",
    template: "%s · Vol D'Oiseau",
  },
  description:
    "Vol D'Oiseau — a French-inspired boutique in the heart of Tel Aviv. Evening gowns and wedding dresses for sale and rental, bespoke dressmaking, alterations, and sewing classes.",
  applicationName: "Vol D'Oiseau",
  openGraph: {
    siteName: "Vol D'Oiseau",
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, alt: "Vol D'Oiseau boutique — King George 6, Tel Aviv" }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Resolve the active locale on the server so <html lang/dir> is correct in the
  // very first byte sent to crawlers and to Hebrew/Arabic visitors (no client flip).
  const locale = await getLocale()
  const dir = getDirection(locale)

  return (
    <html lang={locale} dir={dir} className="h-full" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-navy text-cream antialiased">{children}</body>
    </html>
  )
}
