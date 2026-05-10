import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Artwork } from '@/lib/types'
import ArtworkGallery from '@/components/ArtworkGallery'

type Props = {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: Props) {
  const { handle } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('artworks').select('title, year, medium').eq('handle', handle).single()
  if (!data) return {}
  return {
    title: `${data.title}${data.year ? ` (${data.year})` : ''} — George Gagoshidze`,
    description: data.medium ?? undefined,
  }
}

export const revalidate = 60

export default async function ArtworkPage({ params }: Props) {
  const { handle } = await params
  const supabase = await createClient()

  const { data: artwork } = await supabase
    .from('artworks')
    .select('*, artwork_images(*), collections(*)')
    .eq('handle', handle)
    .single()

  if (!artwork) notFound()

  const a = artwork as Artwork & { collections?: { title: string; handle: string } }
  const images = (a.artwork_images ?? []).sort((x, y) => x.position - y.position)

  return (
    <div className="page-width" style={{ padding: '4rem 0 6rem' }}>
      <div className="artwork-detail">
        {/* Gallery */}
        <ArtworkGallery images={images} title={a.title} />

        {/* Info */}
        <div className="artwork-detail__info" style={{ position: 'sticky', top: '12rem' }}>
          {a.sold && (
            <div style={{ marginBottom: '1.6rem' }}>
              <span className="badge badge--sold">Sold</span>
            </div>
          )}

          <h1 style={{ marginBottom: '2rem' }}>{a.title}</h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', opacity: 0.7, marginBottom: '2.4rem' }}>
            {a.year && <p>{a.year}</p>}
            {a.medium && <p>{a.medium}</p>}
            {a.dimensions && <p>{a.dimensions}</p>}
            {a.collections && (
              <p>
                <Link href={`/collections/${a.collections.handle}`} className="link link--text">
                  {a.collections.title}
                </Link>
              </p>
            )}
          </div>

          {!a.sold && a.price != null && (
            <p style={{ fontSize: 'calc(1.0909 * 2rem)', color: 'rgb(16,57,72)', marginBottom: '2.4rem' }}>
              €{a.price.toLocaleString()}
            </p>
          )}

          {a.description && (
            <p style={{ marginBottom: '3.2rem', opacity: 0.75 }}>{a.description}</p>
          )}

          {!a.sold ? (
            <Link
              href={`/contact?artwork=${encodeURIComponent(a.title)}`}
              className="btn"
            >
              Enquire
            </Link>
          ) : (
            <span className="btn btn--outline" style={{ opacity: 0.4, cursor: 'default' }}>
              Sold
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
