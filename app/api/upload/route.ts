import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  console.log('[POST /api/upload] start')
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const ext = file.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('dress-images')
      .upload(path, file, { contentType: file.type, upsert: false })

    if (uploadError) throw uploadError

    // Signed URL valid for 10 years (browsing dress images on the public site)
    const { data: signed } = await supabase.storage
      .from('dress-images')
      .createSignedUrl(path, 60 * 60 * 24 * 365 * 10)

    console.log('[POST /api/upload] success', path)
    return NextResponse.json({ path, url: signed?.signedUrl })
  } catch (err) {
    console.error('[POST /api/upload] error', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
