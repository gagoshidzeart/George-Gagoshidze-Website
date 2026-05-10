import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const { data: artworks, error } = await supabase
    .from('artworks')
    .select('id, handle, title, artwork_images(*)')
    .order('sort_order')
    .limit(5)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ artworks })
}
