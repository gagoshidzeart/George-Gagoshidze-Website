import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminShell from '@/components/admin/AdminShell'
import ArtworkForm from '@/components/admin/ArtworkForm'
import type { Artwork, Collection } from '@/lib/types'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditArtworkPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect('/admin/login')
  }

  const [{ data: artwork }, { data: collections }] = await Promise.all([
    supabase.from('artworks').select('*, artwork_images(*)').eq('id', id).single(),
    supabase.from('collections').select('*').order('sort_order'),
  ])

  if (!artwork) notFound()

  return (
    <AdminShell user={user}>
      <div className="px-8 py-6">
        <h1 className="text-xl font-medium text-stone-100 mb-6">
          Edit: {(artwork as Artwork).title}
        </h1>
        <ArtworkForm
          artwork={artwork as Artwork}
          collections={(collections as Collection[]) ?? []}
        />
      </div>
    </AdminShell>
  )
}
