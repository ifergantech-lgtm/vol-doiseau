import { createClient } from '@/lib/supabase/server'
import DressForm from '../DressForm'
import { notFound } from 'next/navigation'

export default async function EditDressPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: dress } = await supabase.from('dresses').select('*').eq('id', id).single()
  if (!dress) notFound()

  return (
    <div>
      <h1 className="font-display text-2xl tracking-[0.15em] uppercase text-cream mb-8">Edit Dress</h1>
      <DressForm initial={dress} />
    </div>
  )
}
