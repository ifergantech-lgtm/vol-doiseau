import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getJobStatus } from '@/lib/higgsfield'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  console.log('[GET /api/social/posts/:id/status] start', id)
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: post, error } = await supabase
      .from('social_posts')
      .select('id, status, higgsfield_job_id, video_path')
      .eq('id', id)
      .single()

    if (error || !post) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // If already past 'generating', nothing to poll
    if (post.status !== 'generating') {
      return NextResponse.json({ status: post.status, videoPath: post.video_path })
    }

    if (!post.higgsfield_job_id) {
      return NextResponse.json({ status: 'generating', videoPath: null })
    }

    // Check Higgsfield job
    const job = await getJobStatus(post.higgsfield_job_id)

    if (job.status === 'completed' && job.videoUrl) {
      // Save the video URL and update status to draft
      await supabase
        .from('social_posts')
        .update({ video_path: job.videoUrl, status: 'draft' })
        .eq('id', id)

      console.log('[GET /api/social/posts/:id/status] video ready', id)
      return NextResponse.json({ status: 'draft', videoPath: job.videoUrl })
    }

    if (job.status === 'failed') {
      await supabase.from('social_posts').update({ status: 'failed' }).eq('id', id)
      return NextResponse.json({ status: 'failed', videoPath: null })
    }

    console.log('[GET /api/social/posts/:id/status] still generating', id)
    return NextResponse.json({ status: 'generating', videoPath: null })
  } catch (err) {
    console.error('[GET /api/social/posts/:id/status] error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
