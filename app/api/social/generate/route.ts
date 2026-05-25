import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateVideoFromImage } from '@/lib/higgsfield'
import { generateCaptions } from '@/lib/captions'

export async function POST(req: NextRequest) {
  console.log('[POST /api/social/generate] start')
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { dressId } = await req.json()
    if (!dressId) return NextResponse.json({ error: 'dressId required' }, { status: 400 })

    // Fetch dress details
    const { data: dress, error: dressError } = await supabase
      .from('dresses')
      .select('*')
      .eq('id', dressId)
      .single()

    if (dressError || !dress) {
      return NextResponse.json({ error: 'Dress not found' }, { status: 404 })
    }

    if (!dress.images || dress.images.length === 0) {
      return NextResponse.json({ error: 'Dress has no images' }, { status: 400 })
    }

    // Get a signed URL for the first dress image (valid 7 days — enough for Blotato to download it)
    const imagePath = dress.images[0]
    const { data: signed } = await supabase.storage
      .from('dress-images')
      .createSignedUrl(imagePath, 60 * 60 * 24 * 7)

    const imageUrl = signed?.signedUrl
    if (!imageUrl) {
      return NextResponse.json({ error: 'Could not generate image URL' }, { status: 500 })
    }

    // Generate captions with Claude (runs in parallel with Higgsfield)
    const title = dress.title?.en || dress.title?.fr || dress.title?.he || 'dress'
    const videoPrompt = `A ${dress.category} gown displayed elegantly, soft studio lighting, fashion editorial style, slow cinematic movement`

    const [captions, { jobId }] = await Promise.all([
      generateCaptions(dress),
      generateVideoFromImage(imageUrl, videoPrompt),
    ])

    // Save the draft post
    const { data: post, error: insertError } = await supabase
      .from('social_posts')
      .insert({
        dress_id: dressId,
        image_path: imagePath,
        higgsfield_job_id: jobId,
        caption_he: captions.he,
        caption_fr: captions.fr,
        caption_en: captions.en,
        hashtags: captions.hashtags,
        status: 'generating',
        selected_languages: ['fr', 'en', 'he'],
        platforms: ['instagram', 'facebook'],
      })
      .select()
      .single()

    if (insertError) throw insertError

    console.log('[POST /api/social/generate] success', post.id, 'job:', jobId)
    return NextResponse.json({ postId: post.id }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/social/generate] error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
