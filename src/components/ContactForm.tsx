'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import type { Artwork } from '@/lib/types'

type Props = {
  artworks: Artwork[]
}

export default function ContactForm({ artworks }: Props) {
  const searchParams = useSearchParams()
  const artworkParam = searchParams.get('artwork') ?? ''

  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
    artwork: artworkParam,
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  useEffect(() => {
    if (artworkParam) setForm((f) => ({ ...f, artwork: artworkParam }))
  }, [artworkParam])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div style={{ padding: '3.2rem 0' }}>
        <p>Thank you for your message. George will be in touch shortly.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2.4rem' }}>
      <div>
        <label className="field__label">Name *</label>
        <input
          required
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="field__input"
        />
      </div>

      <div>
        <label className="field__label">Email *</label>
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="field__input"
        />
      </div>

      <div>
        <label className="field__label">Which artwork are you enquiring about?</label>
        <select
          value={form.artwork}
          onChange={(e) => setForm({ ...form, artwork: e.target.value })}
          className="field__select"
        >
          <option value="">— General enquiry —</option>
          {artworks.map((a) => (
            <option key={a.id} value={a.title}>
              {a.title}{a.year ? ` (${a.year})` : ''}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="field__label">Message *</label>
        <textarea
          required
          rows={6}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="field__textarea"
        />
      </div>

      {status === 'error' && (
        <p style={{ color: '#bc5631' }}>Something went wrong. Please try again.</p>
      )}

      <div>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="btn"
          style={{ opacity: status === 'sending' ? 0.5 : undefined }}
        >
          {status === 'sending' ? 'Sending…' : 'Send Message'}
        </button>
      </div>
    </form>
  )
}
