import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LoginButton from '@/components/admin/LoginButton'

type Props = {
  searchParams: Promise<{ error?: string }>
}

export default async function AdminLoginPage({ searchParams }: Props) {
  const { error } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user?.email === process.env.ADMIN_EMAIL) {
    redirect('/admin/artworks')
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm px-8">
        <h1
          className="text-3xl text-center mb-2 text-stone-100"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Admin
        </h1>
        <p className="text-sm text-center text-stone-400 mb-8">George Gagoshidze</p>

        {error === 'access_denied' && (
          <div className="mb-6 text-sm text-red-400 text-center border border-red-800 px-4 py-3 rounded">
            Access denied. Only the site administrator may log in.
          </div>
        )}
        {error === 'auth_error' && (
          <div className="mb-6 text-sm text-red-400 text-center border border-red-800 px-4 py-3 rounded">
            Authentication error. Please try again.
          </div>
        )}

        <LoginButton />
      </div>
    </div>
  )
}
