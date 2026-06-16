import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/seo'

// Welcomes search engines and AI assistants (covered by the global rule), while
// keeping the private admin area and internal APIs out of the index.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
