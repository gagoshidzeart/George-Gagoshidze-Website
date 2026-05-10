'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cloudinaryUrl } from '@/lib/cloudinary'
import type { ArtworkImage } from '@/lib/types'

type Props = {
  images: ArtworkImage[]
  title: string
}

export default function ArtworkGallery({ images, title }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (images.length === 0) {
    return <div className="card__media" />
  }

  const active = images[activeIndex]

  return (
    <div>
      <div className="card__media" style={{ aspectRatio: '3 / 4' }}>
        <Image
          src={cloudinaryUrl(active.cloudinary_public_id, { width: 900, height: 1200 })}
          alt={active.alt_text ?? title}
          fill
          className=""
          sizes="(max-width: 749px) 100vw, 50vw"
          priority
        />
      </div>

      {images.length > 1 && (
        <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.2rem', overflowX: 'auto', paddingBottom: '0.4rem' }}>
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              style={{
                position: 'relative',
                width: '6.4rem',
                height: '6.4rem',
                flexShrink: 0,
                overflow: 'hidden',
                border: `0.2rem solid ${i === activeIndex ? 'rgb(16,57,72)' : 'transparent'}`,
                background: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <Image
                src={cloudinaryUrl(img.cloudinary_public_id, { width: 120, height: 120 })}
                alt={img.alt_text ?? `${title} ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
