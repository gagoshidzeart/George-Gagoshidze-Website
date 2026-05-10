'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { Collection } from '@/lib/types'
import type { ArtworkOption } from '@/app/admin/collections/page'
import { cloudinaryUrl } from '@/lib/cloudinary'

type Props = {
  collections: Collection[]
  artworks: ArtworkOption[]
}

const MEDIUM_KEYWORDS: Record<string, string> = {
  'oil-on-canvas':        'oil',
  'watercolour':          'watercolour',
  'tempera':              'tempera',
  'mixed-media-on-paper': 'mixed',
  'plywood':              'plywood',
}

function artworksForCollection(artworks: ArtworkOption[], collection: Collection): ArtworkOption[] {
  if (collection.handle === 'featured-works') {
    return artworks.filter((a) => a.featured)
  }
  const keyword = MEDIUM_KEYWORDS[collection.handle]
  if (keyword) {
    return artworks.filter((a) => a.medium?.toLowerCase().includes(keyword))
  }
  return artworks.filter((a) => a.collection_id === collection.id)
}

const BLANK = { title: '', handle: '', description: '', sort_order: '0', cover_artwork_id: '' }

export default function CollectionsManager({ collections, artworks }: Props) {
  const router = useRouter()
  const [form, setForm] = useState(BLANK)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [artworkSearch, setArtworkSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function slugify(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  function startEdit(c: Collection) {
    setEditingId(c.id)
    setArtworkSearch('')
    setForm({
      title: c.title,
      handle: c.handle,
      description: c.description ?? '',
      sort_order: c.sort_order.toString(),
      cover_artwork_id: c.cover_artwork_id ?? '',
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setArtworkSearch('')
    setForm(BLANK)
  }

  const editingCollection = collections.find((c) => c.id === editingId) ?? null

  const collectionArtworks = useMemo(
    () => editingCollection ? artworksForCollection(artworks, editingCollection) : artworks,
    [artworks, editingCollection]
  )

  const filteredArtworks = useMemo(() => {
    const q = artworkSearch.toLowerCase()
    return q
      ? collectionArtworks.filter((a) => a.title.toLowerCase().includes(q) || a.handle.includes(q))
      : collectionArtworks
  }, [collectionArtworks, artworkSearch])

  const selectedArtwork = artworks.find((a) => a.id === form.cover_artwork_id) ?? null

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        sort_order: parseInt(form.sort_order) || 0,
        cover_artwork_id: form.cover_artwork_id || null,
      }
      const url = editingId ? `/api/admin/collections/${editingId}` : '/api/admin/collections'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error ?? 'Save failed')
      }
      cancelEdit()
      router.refresh()
    } catch (err: any) {
      setError(err.message ?? 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete collection "${title}"?`)) return
    await fetch(`/api/admin/collections/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  const inputClass =
    'w-full bg-stone-800 border border-stone-700 text-stone-100 px-3 py-2 text-sm focus:outline-none focus:border-stone-400'
  const labelClass = 'block text-xs text-stone-400 uppercase tracking-wider mb-1'

  return (
    <div className="space-y-8">
      {/* Form */}
      <div className="border border-stone-700 p-5">
        <h2 className="text-sm text-stone-300 mb-4">
          {editingId ? 'Edit Collection' : 'New Collection'}
        </h2>
        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Title</label>
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value, handle: editingId ? f.handle : slugify(e.target.value) }))
              }
            />
          </div>
          <div>
            <label className={labelClass}>Handle</label>
            <input
              className={inputClass}
              value={form.handle}
              onChange={(e) => setForm({ ...form, handle: e.target.value })}
            />
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Description</label>
            <textarea
              rows={2}
              className={inputClass + ' resize-none'}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
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
        </div>

        {/* Cover artwork picker */}
        <div className="mt-4">
          <label className={labelClass}>Cover Image</label>
          <div className="flex gap-4 items-start">
            {/* Current selection preview */}
            <div className="flex-shrink-0 w-20 h-24 bg-stone-700 relative overflow-hidden">
              {selectedArtwork?.cover_public_id ? (
                <Image
                  src={cloudinaryUrl(selectedArtwork.cover_public_id, { width: 160, height: 200 })}
                  alt={selectedArtwork.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-stone-500 text-xs text-center px-1">
                  Auto (first artwork)
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <input
                className={inputClass}
                placeholder="Search artworks…"
                value={artworkSearch}
                onChange={(e) => setArtworkSearch(e.target.value)}
              />
              <div className="border border-stone-700 max-h-48 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => { setForm((f) => ({ ...f, cover_artwork_id: '' })); setArtworkSearch('') }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    !form.cover_artwork_id
                      ? 'bg-stone-600 text-white'
                      : 'text-stone-400 hover:bg-stone-700 hover:text-white'
                  }`}
                >
                  — Auto (first artwork in collection)
                </button>
                {filteredArtworks.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => { setForm((f) => ({ ...f, cover_artwork_id: a.id })); setArtworkSearch('') }}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2 ${
                      form.cover_artwork_id === a.id
                        ? 'bg-stone-600 text-white'
                        : 'text-stone-300 hover:bg-stone-700 hover:text-white'
                    }`}
                  >
                    {a.cover_public_id && (
                      <div className="relative w-7 h-8 flex-shrink-0 overflow-hidden">
                        <Image
                          src={cloudinaryUrl(a.cover_public_id, { width: 56, height: 64 })}
                          alt={a.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <span className="truncate">{a.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-stone-100 text-stone-900 text-xs tracking-wide px-5 py-2 hover:bg-white transition-colors disabled:opacity-40"
          >
            {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Create'}
          </button>
          {editingId && (
            <button onClick={cancelEdit} className="text-stone-400 text-xs hover:text-stone-100">
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="border border-stone-700 divide-y divide-stone-700">
        {collections.length > 0 ? (
          collections.map((c) => (
            <div key={c.id} className="flex items-center px-4 py-3 gap-4">
              <div className="flex-1">
                <p className="text-sm text-stone-100">{c.title}</p>
                <p className="text-xs text-stone-500">{c.handle}</p>
              </div>
              <div className="flex gap-4 text-xs">
                <button
                  onClick={() => startEdit(c)}
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c.id, c.title)}
                  className="text-stone-500 hover:text-red-400 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="px-4 py-6 text-sm text-stone-500">No collections yet.</p>
        )}
      </div>
    </div>
  )
}
