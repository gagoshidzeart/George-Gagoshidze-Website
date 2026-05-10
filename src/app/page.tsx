import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import ArtworkCard from '@/components/ArtworkCard'
import { cloudinaryUrl } from '@/lib/cloudinary'
import type { Artwork, Collection } from '@/lib/types'

export const revalidate = 60

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: featuredArtworks }, { data: collections }, { data: heroRows }, { data: fallbackHero }] =
    await Promise.all([
      supabase
        .from('artworks')
        .select('*, artwork_images(*)')
        .eq('featured', true)
        .order('sort_order')
        .limit(6),
      supabase.from('collections').select('*').order('sort_order').limit(7),
      supabase
        .from('artworks')
        .select('*, artwork_images(*)')
        .eq('hero', true)
        .limit(1),
      supabase
        .from('artworks')
        .select('*, artwork_images(*)')
        .order('sort_order')
        .limit(1),
    ])

  const hero = (heroRows?.[0] ?? fallbackHero?.[0]) as Artwork | undefined
  const heroPrimaryImage = hero?.artwork_images?.find((i) => i.position === 0) ?? hero?.artwork_images?.[0]

  return (
    <>
      {/* Hero */}
      <section style={{ position: 'relative', height: '90vh', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        {heroPrimaryImage ? (
          <Image
            src={cloudinaryUrl(heroPrimaryImage.cloudinary_public_id, { width: 1800, height: 1200 })}
            alt={hero?.title ?? 'George Gagoshidze'}
            fill
            priority
            style={{ objectFit: 'cover' }}
            sizes="100vw"
          />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: '#ebeced' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,44,70,0.6) 0%, transparent 60%)' }} />
        <div style={{ position: 'relative', zIndex: 10, padding: '4rem 3.2rem', color: '#fcfcfc' }}>
          <Link
            href="/works"
            className="btn"
            style={{ background: 'transparent', borderColor: '#fcfcfc', color: '#fcfcfc' }}
          >
            Explore all paintings
          </Link>
        </div>
      </section>

      {/* Featured Artworks */}
      {featuredArtworks && featuredArtworks.length > 0 && (
        <section className="page-width scroll-trigger animate--slide-in" style={{ padding: '6rem 0' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '4rem' }}>
            <h2>Featured Works</h2>
            <Link href="/works" className="link link--text" style={{ fontSize: '1.3rem', opacity: 0.6 }}>
              View All
            </Link>
          </div>
          <div className="grid">
            {(featuredArtworks as Artwork[]).map((artwork) => (
              <div key={artwork.id} className="grid__item">
                <ArtworkCard artwork={artwork} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Collections */}
      {collections && collections.length > 0 && (
        <section className="page-width scroll-trigger animate--slide-in" style={{ padding: '4rem 0 6rem', borderTop: '0.1rem solid rgba(16,57,72,0.08)' }}>
          <h2 style={{ marginBottom: '3.2rem' }}>Collections</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.2rem' }}>
            {(collections as Collection[]).map((c) => (
              <Link
                key={c.id}
                href={`/collections/${c.handle}`}
                className="btn btn--outline"
              >
                {c.title}
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
