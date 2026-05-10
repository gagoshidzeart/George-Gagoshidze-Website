import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import AdminShell from '@/components/admin/AdminShell'
import { cloudinaryUrl } from '@/lib/cloudinary'
import type { Artwork } from '@/lib/types'
import DeleteArtworkButton from '@/components/admin/DeleteArtworkButton'

export const dynamic = 'force-dynamic'

export default async function AdminArtworksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect('/admin/login')
  }

  const { data: artworks } = await supabase
    .from('artworks')
    .select('*, artwork_images(*)')
    .order('sort_order')

  return (
    <AdminShell user={user}>
      <div className="px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-medium text-stone-100">Artworks</h1>
          <Link
            href="/admin/artworks/new"
            className="bg-stone-100 text-stone-900 text-xs tracking-wide px-4 py-2 hover:bg-white transition-colors"
          >
            + Add Artwork
          </Link>
        </div>

        <div className="border border-stone-700 divide-y divide-stone-700">
          {artworks && artworks.length > 0 ? (
            (artworks as Artwork[]).map((artwork) => {
              const primary = artwork.artwork_images?.find((i) => i.position === 0) ?? artwork.artwork_images?.[0]
              return (
                <div key={artwork.id} className="flex items-center gap-4 px-4 py-3">
                  <div className="w-14 h-14 flex-shrink-0 bg-stone-800 overflow-hidden">
                    {primary ? (
                      <Image
                        src={cloudinaryUrl(primary.cloudinary_public_id, { width: 80, height: 80 })}
                        alt={artwork.title}
                        width={56}
                        height={56}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-stone-100 truncate">{artwork.title}</p>
                    <p className="text-xs text-stone-400">
                      {artwork.year ?? '—'} · {artwork.medium ?? '—'}
                    </p>
                  </div>

                  <div className="text-xs text-stone-300 w-20 text-right">
                    {artwork.price != null ? `€${artwork.price.toLocaleString()}` : '—'}
                  </div>

                  <div className="w-16 text-center">
                    {artwork.sold ? (
                      <span className="text-[10px] bg-stone-600 text-stone-200 px-2 py-0.5 uppercase tracking-wide">
                        Sold
                      </span>
                    ) : (
                      <span className="text-[10px] bg-emerald-900 text-emerald-300 px-2 py-0.5 uppercase tracking-wide">
                        Available
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3 text-xs">
                    <Link
                      href={`/admin/artworks/${artwork.id}`}
                      className="text-stone-400 hover:text-white transition-colors"
                    >
                      Edit
                    </Link>
                    <DeleteArtworkButton id={artwork.id} title={artwork.title} />
                  </div>
                </div>
              )
            })
          ) : (
            <div className="px-4 py-8 text-center text-stone-500 text-sm">
              No artworks yet.{' '}
              <Link href="/admin/artworks/new" className="underline">
                Add the first one.
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  )
}
