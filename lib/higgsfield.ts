// Higgsfield AI — image-to-video generation client
// API docs: https://cloud.higgsfield.ai
// Verify exact endpoint paths against your Higgsfield dashboard → API section

const BASE_URL = 'https://api.cloud.higgsfield.ai'

type GenerationStatus = 'pending' | 'processing' | 'completed' | 'failed'

export async function generateVideoFromImage(
  imageUrl: string,
  prompt: string
): Promise<{ jobId: string }> {
  const res = await fetch(`${BASE_URL}/v1/generations`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.HIGGSFIELD_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'kling-1.6',
      type: 'image_to_video',
      image_url: imageUrl,
      prompt,
      duration: 5,
      aspect_ratio: '9:16', // vertical for Instagram Reels
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Higgsfield generate error ${res.status}: ${text}`)
  }

  const data = await res.json()
  // Adjust `data.id` if the API returns a different field name
  return { jobId: data.id }
}

export async function getJobStatus(
  jobId: string
): Promise<{ status: GenerationStatus; videoUrl?: string }> {
  const res = await fetch(`${BASE_URL}/v1/generations/${jobId}`, {
    headers: {
      Authorization: `Bearer ${process.env.HIGGSFIELD_API_KEY}`,
    },
  })

  if (!res.ok) {
    throw new Error(`Higgsfield status check failed: ${res.status}`)
  }

  const data = await res.json()
  return {
    status: data.status as GenerationStatus,
    videoUrl: data.video_url ?? data.output?.video_url,
  }
}
