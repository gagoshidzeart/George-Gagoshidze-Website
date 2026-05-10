import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin — George Gagoshidze',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-900 text-stone-100" style={{ fontFamily: "'Jost', sans-serif" }}>
      {children}
    </div>
  )
}
