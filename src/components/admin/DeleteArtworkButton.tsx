'use client'

import { useRouter } from 'next/navigation'

type Props = {
  id: string
  title: string
}

export default function DeleteArtworkButton({ id, title }: Props) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    await fetch(`/api/admin/artworks/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      className="text-stone-500 hover:text-red-400 transition-colors"
    >
      Delete
    </button>
  )
}
