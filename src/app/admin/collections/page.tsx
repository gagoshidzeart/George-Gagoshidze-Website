import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminShell from '@/components/admin/AdminShell'
import CollectionsManager from '@/components/admin/CollectionsManager'
import type { Collection } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function AdminCollectionsPage() {
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
        <h1 className="text-xl font-medium text-stone-100 mb-6">Collections</h1>
        <CollectionsManager collections={(collections as Collection[]) ?? []} />
      </div>
    </AdminShell>
  )
}
