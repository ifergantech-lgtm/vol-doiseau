import type { MetadataRoute } from 'next'

// Web app manifest — lets the site be installed/added to a home screen and
// gives browsers brand colours. Colours come from the locked logo palette.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vol D'Oiseau — Boutique de robes, Tel Aviv",
    short_name: "Vol D'Oiseau",
    description:
      'Evening gowns & wedding dresses — sale, rental, bespoke dressmaking, alterations and sewing classes in Tel Aviv.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1a1f3a',
    theme_color: '#1a1f3a',
    icons: [
      { src: '/logo-bird.png', sizes: 'any', type: 'image/png', purpose: 'any' },
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  }
}
