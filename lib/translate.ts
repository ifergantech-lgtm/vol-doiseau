/**
 * lib/translate.ts — server-side translation for dress titles/descriptions.
 *
 * Élisheva fills in French only; missing English/Hebrew are translated
 * automatically when a dress is saved. Existing (non-empty) values are
 * never overwritten.
 *
 * Engine: Anthropic Claude if a real ANTHROPIC_API_KEY is configured
 * (best quality for fashion copy), otherwise a free Google Translate
 * endpoint. On any failure the field is simply left empty — the public
 * site falls back across locales, and the save is never blocked.
 */

const LOCALES = ['en', 'fr', 'he'] as const
type Locale = (typeof LOCALES)[number]
type LocalizedText = Partial<Record<Locale, string>>

// Google's endpoint uses the legacy code for Hebrew
const GOOGLE_LANG: Record<Locale, string> = { en: 'en', fr: 'fr', he: 'iw' }

function hasRealAnthropicKey(): boolean {
  const key = process.env.ANTHROPIC_API_KEY || ''
  return key.startsWith('sk-ant')
}

async function translateViaGoogle(text: string, from: Locale, to: Locale): Promise<string | null> {
  try {
    const url =
      'https://translate.googleapis.com/translate_a/single?client=gtx&dt=t' +
      `&sl=${GOOGLE_LANG[from]}&tl=${GOOGLE_LANG[to]}&q=${encodeURIComponent(text)}`
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return null
    const data = await res.json()
    // Response shape: [[[translated, original, ...], ...], ...]
    const segments = (data?.[0] || []) as unknown[][]
    const out = segments.map((s) => s?.[0]).filter(Boolean).join('')
    return out || null
  } catch (err) {
    console.error(`[translate] google ${from}->${to} failed`, err)
    return null
  }
}

async function translateViaAnthropic(
  fields: { title?: string; description?: string },
  from: Locale,
  targets: Locale[]
): Promise<Partial<Record<Locale, { title?: string; description?: string }>> | null> {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1500,
        messages: [
          {
            role: 'user',
            content:
              `Translate this luxury boutique dress listing from ${from} into: ${targets.join(', ')}.\n` +
              `Titles follow Mac Duggal product-name style (descriptive, elegant). ` +
              `Keep fashion terminology natural in each language.\n\n` +
              `Input JSON: ${JSON.stringify(fields)}\n\n` +
              `Reply with ONLY valid JSON, no markdown, shaped like: ` +
              `{${targets.map((t) => `"${t}":{"title":"...","description":"..."}`).join(',')}}` +
              ` — omit "title" or "description" keys that were absent in the input.`,
          },
        ],
      }),
      signal: AbortSignal.timeout(20000),
    })
    if (!res.ok) {
      console.error('[translate] anthropic HTTP', res.status)
      return null
    }
    const data = await res.json()
    const text: string = data?.content?.[0]?.text || ''
    const jsonText = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim()
    return JSON.parse(jsonText)
  } catch (err) {
    console.error('[translate] anthropic failed', err)
    return null
  }
}

/**
 * Fills missing locales in `title` / `description` by translating from the
 * best available source (fr preferred). Mutates nothing; returns new objects.
 */
export async function autoTranslateDress(body: {
  title?: LocalizedText
  description?: LocalizedText
  [key: string]: unknown
}): Promise<typeof body> {
  console.log('[translate] autoTranslateDress start')
  const title: LocalizedText = { ...(body.title || {}) }
  const description: LocalizedText = { ...(body.description || {}) }

  // Source locale: prefer French (Élisheva's language), then English, then Hebrew
  const source = (['fr', 'en', 'he'] as Locale[]).find(
    (l) => (title[l] || '').trim() || (description[l] || '').trim()
  )
  if (!source) return body

  const targets = LOCALES.filter(
    (l) =>
      l !== source &&
      ((!(title[l] || '').trim() && (title[source] || '').trim()) ||
        (!(description[l] || '').trim() && (description[source] || '').trim()))
  )
  if (targets.length === 0) return body

  // Preferred engine: Claude (if a real key is set)
  if (hasRealAnthropicKey()) {
    const result = await translateViaAnthropic(
      {
        title: (title[source] || '').trim() || undefined,
        description: (description[source] || '').trim() || undefined,
      },
      source,
      targets
    )
    if (result) {
      for (const t of targets) {
        if (!(title[t] || '').trim() && result[t]?.title) title[t] = result[t]!.title
        if (!(description[t] || '').trim() && result[t]?.description) description[t] = result[t]!.description
      }
      console.log('[translate] autoTranslateDress done (anthropic)', targets.join(','))
      return { ...body, title, description }
    }
    // fall through to Google on failure
  }

  // Free fallback: Google, field by field
  for (const t of targets) {
    if (!(title[t] || '').trim() && (title[source] || '').trim()) {
      const tr = await translateViaGoogle(title[source]!.trim(), source, t)
      if (tr) title[t] = tr
    }
    if (!(description[t] || '').trim() && (description[source] || '').trim()) {
      const tr = await translateViaGoogle(description[source]!.trim(), source, t)
      if (tr) description[t] = tr
    }
  }

  console.log('[translate] autoTranslateDress done (google)', targets.join(','))
  return { ...body, title, description }
}
