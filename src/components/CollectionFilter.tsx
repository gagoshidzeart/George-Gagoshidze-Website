'use client'

import { useRouter } from 'next/navigation'
import type { Collection } from '@/lib/types'

type Props = {
  collections: Collection[]
  activeHandle?: string
}

export default function CollectionFilter({ collections, activeHandle }: Props) {
  const router = useRouter()

  function handleChange(handle: string) {
    if (handle) {
      router.push(`/works?collection=${handle}`)
    } else {
      router.push('/works')
    }
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
      <button
        onClick={() => handleChange('')}
        className={!activeHandle ? 'btn' : 'btn btn--outline'}
      >
        All
      </button>
      {collections.map((c) => (
        <button
          key={c.id}
          onClick={() => handleChange(c.handle)}
          className={activeHandle === c.handle ? 'btn' : 'btn btn--outline'}
        >
          {c.title}
        </button>
      ))}
    </div>
  )
}
