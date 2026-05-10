'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

const NAV_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/works', label: 'Works' },
  { href: '/collections', label: 'Projects' },
]

export default function Nav() {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Scroll-up sticky: hide on scroll down, reveal on scroll up
  useEffect(() => {
    function onScroll() {
      const current = window.scrollY
      const headerHeight = wrapperRef.current?.offsetHeight ?? 80
      if (current <= headerHeight) {
        setHidden(false)
      } else if (current > lastScrollY.current) {
        setHidden(true)
      } else {
        setHidden(false)
      }
      lastScrollY.current = current
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false) }, [pathname])

  return (
    <>
      {/* Announcement bar */}
      <div className="announcement-bar" role="region" aria-label="Announcement">
        <p>Original paintings available — enquire via contact</p>
      </div>

      {/* Sticky header wrapper */}
      <div
        ref={wrapperRef}
        className={`header-wrapper${hidden ? ' header-wrapper--hidden' : ''}`}
      >
        <header className="header">
          {/* Mobile hamburger (grid-area: menu) */}
          <button
            className="header__menu-btn"
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
          >
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden>
              <rect y="0"  width="20" height="2" rx="1" fill="currentColor" />
              <rect y="6"  width="20" height="2" rx="1" fill="currentColor" />
              <rect y="12" width="20" height="2" rx="1" fill="currentColor" />
            </svg>
          </button>

          {/* Logo (grid-area: heading) */}
          <div className="header__heading">
            <Link href="/" className="header__heading-link">
              George Gagoshidze
            </Link>
          </div>

          {/* Desktop nav (grid-area: navigation) */}
          <nav className="header__inline-menu" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="header__menu-item"
                aria-current={pathname.startsWith(link.href) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Icons (grid-area: icons) — Contact is here, not in nav */}
          <div className="header__icons">
            <Link href="/contact" className="header__icon-link">
              Contact
            </Link>
          </div>
        </header>
      </div>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={() => setDrawerOpen(false)}
          aria-hidden
        />
      )}

      {/* Mobile drawer */}
      <nav
        className={`mobile-menu-drawer${drawerOpen ? ' mobile-menu-drawer--open' : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!drawerOpen}
      >
        <button
          onClick={() => setDrawerOpen(false)}
          aria-label="Close menu"
          style={{ background: 'none', border: 'none', cursor: 'pointer', alignSelf: 'flex-end', color: 'rgb(16,57,72)', marginBottom: '1rem' }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <line x1="1" y1="1" x2="17" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="17" y1="1" x2="1" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
        <Link href="/contact">Contact</Link>
      </nav>
    </>
  )
}
