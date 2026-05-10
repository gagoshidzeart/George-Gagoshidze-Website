'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { Artwork, ArtworkImage, Collection } from '@/lib/types'
import { cloudinaryUrl } from '@/lib/cloudinary'

type Props = {
  artwork?: Artwork & { artwork_images?: ArtworkImage[] }
  collections: Collection[]
}

export default function ArtworkForm({ artwork, collections }: Props) {
  const router = useRouter()
  const isEdit = !!artwork

  const [form, setForm] = useState({
    title: artwork?.title ?? '',
    handle: artwork?.handle ?? '',
    year: artwork?.year?.toString() ?? '',
    dimensions: artwork?.dimensions ?? '',
    medium: artwork?.medium ?? '',
    price: artwork?.price?.toString() ?? '',
    sold: artwork?.sold ?? false,
    featured: artwork?.featured ?? false,
    collection_id: artwork?.collection_id ?? '',
    description: artwork?.description ?? '',
    sort_order: artwork?.sort_order?.toString() ?? '0',
  })

  const [images, setImages] = useState<ArtworkImage[]>(
    artwork?.artwork_images?.sort((a, b) => a.position - b.position) ?? []
  )
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function slugify(s: string) {
    return s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  function handleTitleChange(title: string) {
    setForm((f) => ({
      ...f,
      title,
      handle: isEdit ? f.handle : slugify(title),
    }))
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    try {
      for (const file of files) {
        const data = new FormData()
        data.append('file', file)
        const res = await fetch('/api/admin/upload', { method: 'POST', body: data })
        if (!res.ok) throw new Error('Upload failed')
        const { public_id, secure_url } = await res.json()
        setImages((prev) => [
          ...prev,
          {
            id: `temp-${Date.now()}-${Math.random()}`,
            artwork_id: artwork?.id ?? '',
            cloudinary_public_id: public_id,
            cloudinary_url: secure_url,
            position: prev.length,
            alt_text: null,
            created_at: new Date().toISOString(),
          },
        ])
      }
    } catch {
      setError('Image upload failed. Please try again.')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index).map((img, i) => ({ ...img, position: i })))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      ...form,
      year: form.year ? parseInt(form.year) : null,
      price: form.price ? parseFloat(form.price) : null,
      sort_order: parseInt(form.sort_order) || 0,
      collection_id: form.collection_id || null,
      images: images.map((img, i) => ({
        cloudinary_public_id: img.cloudinary_public_id,
        cloudinary_url: img.cloudinary_url,
        position: i,
        alt_text: img.alt_text,
      })),
    }

    try {
      const url = isEdit ? `/api/admin/artworks/${artwork!.id}` : '/api/admin/artworks'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error ?? 'Save failed')
      }
      router.push('/admin/artworks')
      router.refresh()
    } catch (err: any) {
      setError(err.message ?? 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'w-full bg-stone-800 border border-stone-700 text-stone-100 px-3 py-2 text-sm focus:outline-none focus:border-stone-400 transition-colors'
  const labelClass = 'block text-xs text-stone-400 uppercase tracking-wider mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="text-sm text-red-400 border border-red-800 px-4 py-3">{error}</div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className={labelClass}>Title *</label>
          <input
            required
            className={inputClass}
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
        </div>

        <div className="col-span-2">
          <label className={labelClass}>Handle (slug) *</label>
          <input
            required
            className={inputClass}
            value={form.handle}
            onChange={(e) => setForm({ ...form, handle: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClass}>Year</label>
          <input
            type="number"
            className={inputClass}
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClass}>Dimensions</label>
          <input
            className={inputClass}
            placeholder="e.g. 90 × 120 cm"
            value={form.dimensions}
            onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClass}>Medium</label>
          <input
            className={inputClass}
            placeholder="e.g. Oil on canvas"
            value={form.medium}
            onChange={(e) => setForm({ ...form, medium: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClass}>Price (EUR)</label>
          <input
            type="number"
            step="0.01"
            className={inputClass}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClass}>Collection</label>
          <select
            className={inputClass + ' bg-stone-800'}
            value={form.collection_id}
            onChange={(e) => setForm({ ...form, collection_id: e.target.value })}
          >
            <option value="">— None —</option>
            {collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Sort Order</label>
          <input
            type="number"
            className={inputClass}
            value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
          />
        </div>

        <div className="flex items-center gap-6 col-span-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.sold}
              onChange={(e) => setForm({ ...form, sold: e.target.checked })}
              className="w-4 h-4 accent-stone-400"
            />
            <span className="text-sm text-stone-300">Sold</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="w-4 h-4 accent-stone-400"
            />
            <span className="text-sm text-stone-300">Featured on homepage</span>
          </label>
        </div>

        <div className="col-span-2">
          <label className={labelClass}>Description</label>
          <textarea
            rows={4}
            className={inputClass + ' resize-none'}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
      </div>

      {/* Images */}
      <div>
        <label className={labelClass}>Images</label>

        {images.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {images.map((img, i) => (
              <div key={img.id} className="relative group w-20 h-20">
                <Image
                  src={cloudinaryUrl(img.cloudinary_public_id, { width: 120, height: 120 })}
                  alt={`Image ${i + 1}`}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
                {i === 0 && (
                  <span className="absolute bottom-0 left-0 right-0 text-[9px] text-center bg-stone-900/80 text-stone-200 py-0.5">
                    Cover
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-0 right-0 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="block border border-dashed border-stone-600 px-4 py-6 text-center cursor-pointer hover:border-stone-400 transition-colors">
          <span className="text-sm text-stone-400">
            {uploading ? 'Uploading…' : 'Click to upload images (or drag & drop)'}
          </span>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving || uploading}
          className="bg-stone-100 text-stone-900 text-xs tracking-wide px-6 py-2.5 hover:bg-white transition-colors disabled:opacity-40"
        >
          {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Artwork'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/artworks')}
          className="text-stone-400 text-xs hover:text-stone-100 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
