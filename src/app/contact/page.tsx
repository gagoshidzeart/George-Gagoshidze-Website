import ContactForm from '@/components/ContactForm'
import { createClient } from '@/lib/supabase/server'
import type { Artwork } from '@/lib/types'

export default async function ContactPage() {
  const supabase = await createClient()
  const { data: artworks } = await supabase
    .from('artworks')
    .select('id, title, handle, sold, year')
    .eq('sold', false)
    .order('sort_order')

  return (
    <div className="page-width" style={{ padding: '4rem 0 6rem', maxWidth: '64rem' }}>
      <h1 style={{ marginBottom: '1.2rem' }}>Contact</h1>
      <p style={{ opacity: 0.65, marginBottom: '4rem' }}>
        To enquire about a work or for general questions, please fill in the form below.
      </p>
      <ContactForm artworks={(artworks as Artwork[]) ?? []} />
    </div>
  )
}
