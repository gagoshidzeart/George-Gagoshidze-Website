import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminShell from '@/components/admin/AdminShell'
import ArtworkForm from '@/components/admin/ArtworkForm'
import type { Collection } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function NewArtworkPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect('/admin/login')
  }

  const { data: collections } = await supabase
    .from('collections')
    .select('*')
    .order('sort_order')

  return (
    <AdminShell user={user}>
      <div className="px-8 py-6">
        <h1 className="text-xl font-medium text-stone-100 mb-6">Add Artwork</h1>
        <ArtworkForm collections={(collections as Collection[]) ?? []} />
      </div>
    </AdminShell>
  )
}
