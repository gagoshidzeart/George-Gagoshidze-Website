import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ArtworkCard from '@/components/ArtworkCard'
import type { Artwork, Collection } from '@/lib/types'

type Props = {
  params: Promise<{ handle: string }>
}

export const revalidate = 60

export default async function CollectionPage({ params }: Props) {
  const { handle } = await params
  const supabase = await createClient()

  const { data: collection } = await supabase
    .from('collections')
    .select('*')
    .eq('handle', handle)
    .single()

  if (!collection) notFound()

  const { data: artworks } = await supabase
    .from('artworks')
    .select('*, artwork_images(*)')
    .eq('collection_id', (collection as Collection).id)
    .order('sort_order')

  return (
    <div className="page-width" style={{ padding: '4rem 0 6rem' }}>
      <div style={{ marginBottom: '4rem' }}>
        <h1 style={{ marginBottom: '1.2rem' }}>{(collection as Collection).title}</h1>
        {(collection as Collection).description && (
          <p style={{ opacity: 0.65, maxWidth: '60rem' }}>{(collection as Collection).description}</p>
        )}
      </div>

      {artworks && artworks.length > 0 ? (
        <div className="grid">
          {(artworks as Artwork[]).map((artwork) => (
            <div key={artwork.id} className="grid__item">
              <ArtworkCard artwork={artwork} />
            </div>
          ))}
        </div>
      ) : (
        <p style={{ opacity: 0.5 }}>No artworks in this collection.</p>
      )}
    </div>
  )
}
