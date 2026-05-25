// Blotato — social media scheduling client
// API docs: https://help.blotato.com/api/start
// Base URL confirmed: https://backend.blotato.com/v2

const BASE_URL = 'https://backend.blotato.com/v2'

interface SchedulePostParams {
  mediaUrl: string          // publicly accessible video or image URL
  caption: string           // combined multilingual caption
  platforms: string[]       // e.g. ['instagram', 'facebook']
  scheduledAt: Date
}

export async function schedulePost(params: SchedulePostParams): Promise<{ postId: string }> {
  const { mediaUrl, caption, platforms, scheduledAt } = params

  const res = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      'api-key': process.env.BLOTATO_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: caption,
      media_urls: [mediaUrl],
      platforms,
      scheduled_at: scheduledAt.toISOString(),
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Blotato API error ${res.status}: ${text}`)
  }

  const data = await res.json()
  return { postId: data.id }
}

// Builds the final caption from selected languages
export function buildCaption(
  captions: { he: string; fr: string; en: string },
  hashtags: string,
  selectedLanguages: string[]
): string {
  const parts: string[] = []
  if (selectedLanguages.includes('fr') && captions.fr) parts.push(captions.fr)
  if (selectedLanguages.includes('en') && captions.en) parts.push(captions.en)
  if (selectedLanguages.includes('he') && captions.he) parts.push(captions.he)
  if (hashtags) parts.push(hashtags)
  return parts.join('\n\n')
}
