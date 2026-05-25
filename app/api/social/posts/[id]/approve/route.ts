import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { schedulePost, buildCaption } from '@/lib/blotato'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  console.log('[POST /api/social/posts/:id/approve] start', id)
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: post, error } = await supabase
      .from('social_posts')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !post) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    if (post.status !== 'draft') {
      return NextResponse.json({ error: 'Post must be in draft status to approve' }, { status: 400 })
    }

    if (!post.video_path) {
      return NextResponse.json({ error: 'Video not ready yet' }, { status: 400 })
    }

    if (!post.scheduled_at) {
      return NextResponse.json({ error: 'scheduled_at is required' }, { status: 400 })
    }

    // Build the final multilingual caption
    const caption = buildCaption(
      { he: post.caption_he, fr: post.caption_fr, en: post.caption_en },
      post.hashtags,
      post.selected_languages
    )

    // Push to Blotato
    const { postId: blatoPostId } = await schedulePost({
      mediaUrl: post.video_path,
      caption,
      platforms: post.platforms,
      scheduledAt: new Date(post.scheduled_at),
    })

    // Update status to scheduled
    const { data: updated, error: updateError } = await supabase
      .from('social_posts')
      .update({ status: 'scheduled', blotato_post_id: blatoPostId })
      .eq('id', id)
      .select()
      .single()

    if (updateError) throw updateError

    console.log('[POST /api/social/posts/:id/approve] scheduled via Blotato', blatoPostId)
    return NextResponse.json(updated)
  } catch (err) {
    console.error('[POST /api/social/posts/:id/approve] error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
