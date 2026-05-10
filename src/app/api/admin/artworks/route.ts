import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) return null
  return user
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  if (!await requireAdmin(supabase)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { images, ...artworkData } = body

  const { data: artwork, error } = await supabase
    .from('artworks')
    .insert(artworkData)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  if (images && images.length > 0) {
    const imageRows = images.map((img: any, i: number) => ({
      artwork_id: artwork.id,
      cloudinary_public_id: img.cloudinary_public_id,
      cloudinary_url: img.cloudinary_url,
      position: i,
      alt_text: img.alt_text ?? null,
    }))
    await supabase.from('artwork_images').insert(imageRows)
  }

  return NextResponse.json(artwork, { status: 201 })
}
