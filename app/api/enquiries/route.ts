import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  console.log('[POST /api/enquiries] start')
  try {
    const body = await req.json()
    const { name, phone, message, enquiry_type, dress_id } = body

    // Email is no longer collected — Élisheva is contacted via WhatsApp / phone,
    // so a phone number is what we require to reach the enquirer back.
    if (!name || !phone || !message || !enquiry_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase.from('enquiries').insert({
      name,
      email: '', // legacy non-null column; email is no longer used
      phone,
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
