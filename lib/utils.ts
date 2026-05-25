export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}

export function formatPrice(amount: number | null | undefined): string {
  if (amount == null) return ''
  return `₪${amount.toLocaleString('he-IL')}`
}

export function getWhatsAppUrl(phone: string): string {
  const clean = phone.replace(/\D/g, '')
  return `https://wa.me/${clean}`
}

export function buildSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export type Locale = 'he' | 'fr' | 'en'

export function getLocalizedText(
  field: Record<string, string> | null | undefined,
  locale: Locale,
  fallback = ''
): string {
  if (!field) return fallback
  return field[locale] || field['en'] || field['fr'] || field['he'] || fallback
}
