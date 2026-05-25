import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['he', 'fr', 'en'],
  defaultLocale: 'he',
})

export type Locale = (typeof routing.locales)[number]
