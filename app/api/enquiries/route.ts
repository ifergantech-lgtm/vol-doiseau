import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  console.log('[POST /api/enquiries] start')
  try {
    const body = await req.json()
    const { name, email, phone, message, enquiry_type, dress_id } = body

    if (!name || !email || !message || !enquiry_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase.from('enquiries').insert({
      name,
      email,
      phone: phone || null,
      message,
      enquiry_type,
      dress_id: dress_id || null,
    })

    if (error) throw error

    console.log('[POST /api/enquiries] success')
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[POST /api/enquiries] error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  console.log('[GET /api/enquiries] start')
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('enquiries')
      .select('*, dresses(slug, title)')
      .order('created_at', { ascending: false })

    if (error) throw error

    console.log('[GET /api/enquiries] success')
    return NextResponse.json(data)
  } catch (err) {
    console.error('[GET /api/enquiries] error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
