import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminShell from '@/components/admin/AdminShell'
import CollectionsManager from '@/components/admin/CollectionsManager'
import type { Collection } from '@/lib/types'

export const dynamic = 'force-dynamic'

export type ArtworkOption = {
  id: string
  title: string
  handle: string
  cover_public_id: string | null
}

export default async function AdminCollectionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect('/admin/login')
  }

  const [{ data: collections }, { data: artworksRaw }] = await Promise.all([
    supabase.from('collections').select('*').order('sort_order'),
    supabase
      .from('artworks')
      .select('id, title, handle, artwork_images(cloudinary_public_id, position)')
      .order('title'),
  ])

  const artworks: ArtworkOption[] = (artworksRaw ?? []).map((a: any) => {
    const sorted = (a.artwork_images ?? []).sort((x: any, y: any) => x.position - y.position)
    return {
      id: a.id,
      title: a.title,
      handle: a.handle,
      cover_public_id: sorted[0]?.cloudinary_public_id ?? null,
    }
  })

  return (
    <AdminShell user={user}>
      <div className="px-8 py-6">
        <h1 className="text-xl font-medium text-stone-100 mb-6">Collections</h1>
        <CollectionsManager
          collections={(collections as Collection[]) ?? []}
          artworks={artworks}
        />
      </div>
    </AdminShell>
  )
}
