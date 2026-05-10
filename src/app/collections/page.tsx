import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { cloudinaryUrl } from '@/lib/cloudinary'
import type { Collection } from '@/lib/types'

export const revalidate = 60

const MEDIUM_FILTERS: Record<string, string> = {
  'oil-on-canvas':        '%oil%',
  'watercolour':          '%watercolour%',
  'tempera':              '%tempera%',
  'mixed-media-on-paper': '%mixed%',
  'plywood':              '%plywood%',
}

export default async function CollectionsPage() {
  const supabase = await createClient()
  const { data: collections } = await supabase
    .from('collections')
    .select('*')
    .eq('is_project', true)
    .order('sort_order')

  if (!collections || collections.length === 0) {
    return (
      <div className="page-width" style={{ padding: '4rem 0 6rem' }}>
        <h1 style={{ marginBottom: '4rem' }}>Projects</h1>
        <p style={{ opacity: 0.5 }}>No collections yet.</p>
      </div>
    )
  }

  // Fetch cover image for each collection in parallel
  const coverImages = await Promise.all(
    (collections as Collection[]).map(async (c) => {
      let data: any = null

      if (c.handle === 'featured-works') {
        const res = await supabase
          .from('artworks')
          .select('artwork_images(cloudinary_public_id, alt_text)')
          .eq('featured', true)
          .order('sort_order')
          .limit(1)
          .single()
        data = res.data
      } else if (MEDIUM_FILTERS[c.handle]) {
        const res = await supabase
          .from('artworks')
          .select('artwork_images(cloudinary_public_id, alt_text)')
          .ilike('medium', MEDIUM_FILTERS[c.handle])
          .order('sort_order')
          .limit(1)
          .single()
        data = res.data
      } else {
        const res = await supabase
          .from('artworks')
          .select('artwork_images(cloudinary_public_id, alt_text)')
          .eq('collection_id', c.id)
          .order('sort_order')
          .limit(1)
          .single()
        data = res.data
      }

      const img = data?.artwork_images?.[0]
      return { publicId: img?.cloudinary_public_id ?? null, alt: img?.alt_text ?? c.title }
    })
  )

  return (
    <div className="page-width" style={{ padding: '4rem 0 6rem' }}>
      <h1 style={{ marginBottom: '4rem' }}>Projects</h1>

      <div className="collections-grid">
        {(collections as Collection[]).map((c, i) => {
          const cover = coverImages[i]
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
