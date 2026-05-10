'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

type Props = {
  user: { email?: string | null; user_metadata?: { avatar_url?: string; full_name?: string } }
  children: React.ReactNode
}

export default function AdminShell({ user, children }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const navItems = [
    { href: '/admin/artworks', label: 'Artworks' },
    { href: '/admin/collections', label: 'Collections' },
  ]

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-stone-950 flex flex-col border-r border-stone-800">
        <div className="px-6 py-5 border-b border-stone-800">
          <Link
            href="/"
            className="text-sm text-stone-400 hover:text-stone-100 transition-colors"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            ← Site
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 text-sm rounded mb-0.5 transition-colors ${
                pathname.startsWith(item.href)
                  ? 'bg-stone-700 text-white'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-stone-800">
          <div className="flex items-center gap-2 mb-3">
            {user.user_metadata?.avatar_url ? (
              <Image
                src={user.user_metadata.avatar_url}
                alt="avatar"
                width={28}
                height={28}
                className="rounded-full"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-stone-600 flex items-center justify-center text-xs">
                {user.email?.[0]?.toUpperCase()}
              </div>
            )}
            <span className="text-xs text-stone-400 truncate">{user.email}</span>
          </div>
          <button
            onClick={handleSignOut}
            className="text-xs text-stone-500 hover:text-stone-200 transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
