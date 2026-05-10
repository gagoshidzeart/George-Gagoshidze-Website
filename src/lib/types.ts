export type Collection = {
  id: string
  handle: string
  title: string
  description: string | null
  sort_order: number
  created_at: string
}

export type ArtworkImage = {
  id: string
  artwork_id: string
  cloudinary_public_id: string
  cloudinary_url: string
  position: number
  alt_text: string | null
  created_at: string
}

export type Artwork = {
  id: string
  handle: string
  title: string
  year: number | null
  dimensions: string | null
  medium: string | null
  price: number | null
  sold: boolean
  collection_id: string | null
  description: string | null
  featured: boolean
  hero: boolean
  sort_order: number
  created_at: string
  artwork_images?: ArtworkImage[]
  collections?: Collection
}
