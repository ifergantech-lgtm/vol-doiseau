import { createClient } from '@/lib/supabase/server'
import DressForm from '../DressForm'
import { notFound } from 'next/navigation'
import { AdminTitle } from '../../adminI18n'

export default async function EditDressPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: dress } = await supabase.from('dresses').select('*').eq('id', id).single()
  if (!dress) notFound()

  return (
    <div>
      <AdminTitle k="editDressTitle" />
      <DressForm initial={dress} />
    </div>
  )
}
