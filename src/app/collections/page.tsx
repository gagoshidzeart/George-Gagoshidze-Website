import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { cloudinaryUrl } from '@/lib/cloudinary'
import type { Collection } from '@/lib/types'

export const revalidate = 60

export default async function CollectionsPage() {
  const supabase = await createClient()
  const { data: collections } = await supabase
    .from('collections')
    .select('*')
    .order('sort_order')

  if (!collections || collections.length === 0) {
    return (
      <div className="page-width" style={{ padding: '4rem 0 6rem' }}>
        <h1 style={{ marginBottom: '4rem' }}>Projects</h1>
        <p style={{ opacity: 0.5 }}>No collections yet.</p>
      </div>
    )
  }

  // Fetch first artwork image for each collection in parallel
  const coverImages = await Promise.all(
    (collections as Collection[]).map(async (c) => {
      const { data } = await supabase
        .from('artworks')
        .select('artwork_images(cloudinary_public_id, alt_text)')
        .eq('collection_id', c.id)
        .order('sort_order')
        .limit(1)
        .single()
      const img = (data as any)?.artwork_images?.[0]
      return { collectionId: c.id, publicId: img?.cloudinary_public_id ?? null, alt: img?.alt_text ?? c.title }
    })
  )

  const coverMap = Object.fromEntries(coverImages.map((ci) => [ci.collectionId, ci]))

  return (
    <div className="page-width" style={{ padding: '4rem 0 6rem' }}>
      <h1 style={{ marginBottom: '4rem' }}>Projects</h1>

      <div className="collections-grid">
        {(collections as Collection[]).map((c) => {
          const cover = coverMap[c.id]
          return (
            <Link
              key={c.id}
              href={`/collections/${c.handle}`}
              className="collection-card"
            >
              <div className="collection-card__image">
                {cover?.publicId ? (
                  <Image
                    src={cloudinaryUrl(cover.publicId, { width: 600, height: 750 })}
                    alt={cover.alt}
                    fill
                    sizes="(max-width: 749px) 100vw, (max-width: 989px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ position: 'absolute', inset: 0, background: '#ebeced' }} />
                )}
              </div>
              <div className="collection-card__content">
                <h2>{c.title}</h2>
                {c.description && (
                  <p style={{ opacity: 0.6, marginTop: '0.6rem' }}>{c.description}</p>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
