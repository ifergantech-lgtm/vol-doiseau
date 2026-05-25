import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  console.log('[GET /api/dresses/:id] start', id)
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('dresses').select('*').eq('id', id).single()
    if (error) throw error
    console.log('[GET /api/dresses/:id] success')
    return NextResponse.json(data)
  } catch (err) {
    console.error('[GET /api/dresses/:id] error', err)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  console.log('[PATCH /api/dresses/:id] start', id)
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { data, error } = await supabase
      .from('dresses')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    console.log('[PATCH /api/dresses/:id] success')
    return NextResponse.json(data)
  } catch (err) {
    console.error('[PATCH /api/dresses/:id] error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  console.log('[DELETE /api/dresses/:id] start', id)
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { error } = await supabase.from('dresses').delete().eq('id', id)
    if (error) throw error

    console.log('[DELETE /api/dresses/:id] success')
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[DELETE /api/dresses/:id] error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
