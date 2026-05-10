'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Collection } from '@/lib/types'

type Props = {
  collections: Collection[]
}

const BLANK = { title: '', handle: '', description: '', sort_order: '0' }

export default function CollectionsManager({ collections }: Props) {
  const router = useRouter()
  const [form, setForm] = useState(BLANK)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function slugify(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  function startEdit(c: Collection) {
    setEditingId(c.id)
    setForm({
      title: c.title,
      handle: c.handle,
      description: c.description ?? '',
      sort_order: c.sort_order.toString(),
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(BLANK)
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        sort_order: parseInt(form.sort_order) || 0,
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
