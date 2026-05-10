import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Collection } from '@/lib/types'

export const revalidate = 60

export default async function CollectionsPage() {
  const supabase = await createClient()
  const { data: collections } = await supabase
    .from('collections')
    .select('*')
    .order('sort_order')

  return (
    <div className="page-width" style={{ padding: '4rem 0 6rem' }}>
      <h1 style={{ marginBottom: '4rem' }}>Projects</h1>

      {collections && collections.length > 0 ? (
        <div className="grid">
          {(collections as Collection[]).map((c) => (
            <Link
              key={c.id}
              href={`/collections/${c.handle}`}
              className="grid__item"
              style={{
                display: 'block',
                border: '0.1rem solid rgba(16,57,72,0.1)',
                padding: '3.2rem',
                transition: 'border-color var(--duration-default)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(16,57,72,0.4)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(16,57,72,0.1)')}
            >
              <h2 style={{ marginBottom: c.description ? '0.8rem' : 0 }}>{c.title}</h2>
              {c.description && (
                <p style={{ opacity: 0.6 }}>{c.description}</p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <p style={{ opacity: 0.5 }}>No collections yet.</p>
      )}
    </div>
  )
}
