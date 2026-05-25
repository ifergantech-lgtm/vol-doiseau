import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  console.log('[GET /api/social/posts] start')
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('social_posts')
      .select(`
        *,
        dress:dress_id (
          id, slug, title, images, category
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    console.log('[GET /api/social/posts] success', data?.length, 'posts')
    return NextResponse.json(data)
  } catch (err) {
    console.error('[GET /api/social/posts] error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
