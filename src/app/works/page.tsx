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

  // Always fetch collections for the filter UI
  const { data: collections } = await supabase
    .from('collections')
    .select('*')
    .order('sort_order')

  let artworks: Artwork[] | null = null

  if (collection) {
    // Resolve collection handle → id first, then query artworks directly
    const { data: col } = await supabase
      .from('collections')
      .select('id')
      .eq('handle', collection)
      .single()

    if (col) {
      const { data } = await supabase
        .from('artworks')
        .select('*, artwork_images(*)')
        .eq('collection_id', col.id)
        .order('sort_order')
      artworks = data as Artwork[]
    }
  } else {
    const { data } = await supabase
      .from('artworks')
      .select('*, artwork_images(*)')
      .order('sort_order')
    artworks = data as Artwork[]
  }

  return (
    <div className="page-width" style={{ padding: '4rem 0 6rem' }}>
      <div style={{ marginBottom: '4rem', display: 'flex', flexDirection: 'column', gap: '2.4rem' }}>
        <h1>Works</h1>
        {collections && (
          <CollectionFilter collections={collections as Collection[]} activeHandle={collection} />
        )}
      </div>

      {artworks && artworks.length > 0 ? (
        <div className="grid">
          {artworks.map((artwork) => (
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
