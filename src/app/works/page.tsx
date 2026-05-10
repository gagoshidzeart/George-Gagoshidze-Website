import { createClient } from '@/lib/supabase/server'
import ArtworkCard from '@/components/ArtworkCard'
import CollectionFilter from '@/components/CollectionFilter'
import type { Artwork, Collection } from '@/lib/types'

export const revalidate = 60

type Props = {
  searchParams: Promise<{ collection?: string }>
}

export default async function WorksPage({ searchParams }: Props) {
  const { collection } = await searchParams
  const supabase = await createClient()

  const [{ data: artworks }, { data: collections }] = await Promise.all([
    collection
      ? supabase
          .from('artworks')
          .select('*, artwork_images(*), collections(*)')
          .eq('collections.handle', collection)
          .not('collection_id', 'is', null)
          .order('sort_order')
      : supabase
          .from('artworks')
          .select('*, artwork_images(*), collections(*)')
          .order('sort_order'),
    supabase.from('collections').select('*').order('sort_order'),
  ])

  const filtered = collection && artworks
    ? (artworks as Artwork[]).filter((a) => (a as any).collections?.handle === collection)
    : (artworks as Artwork[] | null)

  return (
    <div className="page-width" style={{ padding: '4rem 0 6rem' }}>
      <div style={{ marginBottom: '4rem', display: 'flex', flexDirection: 'column', gap: '2.4rem' }}>
        <h1>Works</h1>
        {collections && (
          <CollectionFilter collections={collections as Collection[]} activeHandle={collection} />
        )}
      </div>

      {filtered && filtered.length > 0 ? (
        <div className="grid scroll-trigger animate--slide-in">
          {filtered.map((artwork) => (
            <div key={artwork.id} className="grid__item">
              <ArtworkCard artwork={artwork} />
            </div>
          ))}
        </div>
      ) : (
        <p style={{ opacity: 0.5 }}>No artworks found.</p>
      )}
    </div>
  )
}
