// Caption generation using Claude claude-haiku-4-5-20251001 via Anthropic Messages API

interface Dress {
  title: Record<string, string>
  description: Record<string, string>
  category: string
  availability: string
  price_sale?: number | null
  price_rental?: number | null
}

interface GeneratedCaptions {
  he: string
  fr: string
  en: string
  hashtags: string
}

export async function generateCaptions(dress: Dress): Promise<GeneratedCaptions> {
  const title = dress.title?.en || dress.title?.fr || dress.title?.he || 'dress'
  const descEn = dress.description?.en || ''
  const descFr = dress.description?.fr || ''
  const descHe = dress.description?.he || ''

  const availabilityLabel =
    dress.availability === 'sale' ? 'for sale'
    : dress.availability === 'rental' ? 'for rental'
    : 'for sale and rental'

  const prompt = `You are writing Instagram captions for Vol D'Oiseau, a premium Paris-inspired fashion boutique in Tel Aviv owned by Elisheva Ifergan.

Dress details:
- Name: ${title}
- Category: ${dress.category} gown
- Available: ${availabilityLabel}
- Description (EN): ${descEn}
- Description (FR): ${descFr}
- Description (HE): ${descHe}

Write three short, elegant Instagram captions — one in each language. Each caption should:
- Be 2–4 sentences, warm and sophisticated in tone
- Mention the boutique (@voldoiseauparis) once
- Invite the reader to enquire or visit
- Feel editorial, not salesy
- French caption first (this is the brand's primary language)

Also write a single hashtag block (shared, in English/French/Hebrew) with 15–20 relevant hashtags covering: fashion, evening wear/bridal, Tel Aviv, Paris, boutique, and the dress category.

Respond ONLY with this exact JSON structure (no markdown, no explanation):
{
  "fr": "...",
  "en": "...",
  "he": "...",
  "hashtags": "..."
}`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Anthropic API error ${res.status}: ${text}`)
  }

  const data = await res.json()
  const text = data.content?.[0]?.text || ''

  try {
    const parsed = JSON.parse(text)
    return {
      fr: parsed.fr || '',
      en: parsed.en || '',
      he: parsed.he || '',
      hashtags: parsed.hashtags || '',
    }
  } catch {
    // Fallback if JSON parsing fails
    return {
      fr: `Une robe ${dress.category} d'exception vous attend chez @voldoiseauparis. Venez la découvrir.`,
      en: `A stunning ${dress.category} gown awaits you at @voldoiseauparis. Enquire to book your fitting.`,
      he: `שמלת ${dress.category} מרהיבה מחכה לכם ב-@voldoiseauparis. צרו קשר לפרטים.`,
      hashtags: '#fashion #eveningwear #telaviv #paris #boutique #robedesoir #שמלות #voldoiseauparis',
    }
  }
}
