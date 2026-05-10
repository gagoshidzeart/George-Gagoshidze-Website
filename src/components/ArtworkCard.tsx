import Link from 'next/link'
import Image from 'next/image'
import { Artwork } from '@/lib/types'
import { cloudinaryUrl } from '@/lib/cloudinary'

type Props = {
  artwork: Artwork
}

export default function ArtworkCard({ artwork }: Props) {
  const primaryImage = artwork.artwork_images?.find((i) => i.position === 0) ?? artwork.artwork_images?.[0]
  const imgUrl = primaryImage
    ? cloudinaryUrl(primaryImage.cloudinary_public_id, { width: 600, height: 750 })
    : null

  return (
    <Link href={`/works/${artwork.handle}`} className="card-wrapper block">
      <div className="card__media">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={primaryImage?.alt_text ?? artwork.title}
            fill
            sizes="(max-width: 749px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className=""
          />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(16,57,72,0.3)', fontSize: '1.3rem' }}>
            No image
          </div>
        )}
        {artwork.sold && (
          <div className="card__badge">
            <span className="badge badge--sold">Sold</span>
          </div>
        )}
      </div>
      <div className="card__content">
        <h3 className="card__title">{artwork.title}</h3>
        {artwork.dimensions && (
          <p className="card-product__dimensions">{artwork.dimensions}</p>
        )}
        {artwork.price != null && (
          <p className="card__price">€{artwork.price.toLocaleString()}</p>
        )}
      </div>
    </Link>
  )
}
