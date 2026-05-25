import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  console.log('[GET /api/social/posts/:id] start', id)
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('social_posts')
      .select(`*, dress:dress_id (id, slug, title, images, category)`)
      .eq('id', id)
      .single()

    if (error) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    console.log('[GET /api/social/posts/:id] success')
    return NextResponse.json(data)
  } catch (err) {
    console.error('[GET /api/social/posts/:id] error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  console.log('[PATCH /api/social/posts/:id] start', id)
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    // Only allow editing safe fields
    const allowed = ['caption_he', 'caption_fr', 'caption_en', 'hashtags',
      'selected_languages', 'platforms', 'scheduled_at']
    const update: Record<string, unknown> = {}
    for (const key of allowed) {
      if (key in body) update[key] = body[key]
    }

    const { data, error } = await supabase
      .from('social_posts')
      .update(update)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    console.log('[PATCH /api/social/posts/:id] success')
    return NextResponse.json(data)
  } catch (err) {
    console.error('[PATCH /api/social/posts/:id] error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  console.log('[DELETE /api/social/posts/:id] start', id)
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { error } = await supabase.from('social_posts').delete().eq('id', id)
    if (error) throw error

    console.log('[DELETE /api/social/posts/:id] success')
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[DELETE /api/social/posts/:id] error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
