import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildSlug } from '@/lib/utils'

export async function GET() {
  console.log('[GET /api/dresses] start')
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('dresses')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    console.log('[GET /api/dresses] success')
    return NextResponse.json(data)
  } catch (err) {
    console.error('[GET /api/dresses] error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  console.log('[POST /api/dresses] start')
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const slug = body.slug || buildSlug(body.title?.en || body.title?.fr || body.title?.he || 'dress')

    const { data, error } = await supabase
      .from('dresses')
      .insert({ ...body, slug })
      .select()
      .single()

    if (error) throw error

    console.log('[POST /api/dresses] success', data.id)
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error('[POST /api/dresses] error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
