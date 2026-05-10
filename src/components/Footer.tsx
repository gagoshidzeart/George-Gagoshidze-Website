import Link from 'next/link'

const SOCIAL_LINKS = [
  { href: 'https://www.facebook.com/georgegagoshidze', label: 'Facebook' },
  { href: 'https://www.instagram.com/georgegagoshidze', label: 'Instagram' },
  { href: 'https://www.linkedin.com/in/george-gagoshidze-45100aa6/', label: 'LinkedIn' },
  { href: 'https://www.behance.net/GeorgeGagoshidze', label: 'Behance' },
]

const POLICY_LINKS = [
  { href: '/privacy-policy', label: 'Privacy policy' },
  { href: '/shipping-policy', label: 'Shipping policy' },
  { href: '/refund-policy', label: 'Refund policy' },
  { href: '/terms-of-service', label: 'Terms of service' },
]

// Payment method SVGs (decorative)
function PaymentIcons() {
  return (
    <div className="footer__payment-row">
      {/* Visa */}
      <svg width="38" height="24" viewBox="0 0 38 24" aria-label="Visa" role="img" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.6 }}>
        <rect width="38" height="24" rx="3" fill="#1A1F71"/>
        <path d="M16.539 7.15l-2.607 9.72H11.15L13.756 7.15h2.783zm11.647 6.28l1.463-4.036.84 4.036h-2.303zm3.109 3.44H33.5l-1.99-9.72h-2.079c-.468 0-.864.272-1.04.688l-3.66 9.032h2.563l.509-1.407h3.131l.361 1.407zM25.31 13.93c.011-2.489-3.442-2.627-3.42-3.738.007-.337.33-.697 1.035-.789a4.594 4.594 0 012.401.422l.428-1.995a6.55 6.55 0 00-2.278-.417c-2.408 0-4.102 1.28-4.115 3.112-.015 1.355 1.209 2.11 2.132 2.561.95.46 1.268.756 1.264 1.168-.006.631-.758.91-1.459.921-1.226.018-1.938-.331-2.506-.596l-.442 2.069c.57.262 1.621.49 2.711.5 2.562 0 4.237-1.264 4.25-3.218zm-9.803-6.78l-3.958 9.72H8.977L7.02 9.095c-.115-.453-.215-.619-.564-.81C5.877 7.97 4.85 7.65 3.94 7.453l.06-.303h4.149c.528 0 1.003.352 1.123.961l1.026 5.449 2.534-6.41h2.675z" fill="#fff"/>
      </svg>
      {/* Mastercard */}
      <svg width="38" height="24" viewBox="0 0 38 24" aria-label="Mastercard" role="img" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.6 }}>
        <rect width="38" height="24" rx="3" fill="#252525"/>
        <circle cx="15" cy="12" r="7" fill="#EB001B"/>
        <circle cx="23" cy="12" r="7" fill="#F79E1B"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M19 17.657A6.975 6.975 0 0116.646 12 6.975 6.975 0 0119 6.343 6.975 6.975 0 0121.354 12 6.975 6.975 0 0119 17.657z" fill="#FF5F00"/>
      </svg>
      {/* PayPal */}
      <svg width="38" height="24" viewBox="0 0 38 24" aria-label="PayPal" role="img" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.6 }}>
        <rect width="38" height="24" rx="3" fill="#F3F3F3"/>
        <path d="M25.382 9.134c.12-.778-.001-1.308-.415-1.787-.456-.524-1.278-.748-2.33-.748h-3.054a.435.435 0 00-.43.367l-1.27 8.046a.261.261 0 00.258.301h1.888l-.133.842a.228.228 0 00.225.263h1.582a.38.38 0 00.375-.321l.016-.082.298-1.889.019-.103a.38.38 0 01.375-.321h.236c1.531 0 2.73-.622 3.081-2.421.146-.752.07-1.38-.317-1.822a1.517 1.517 0 00-.404-.325z" fill="#009CDE"/>
        <path d="M14.832 7.099a.435.435 0 00-.43.367l-1.27 8.046a.261.261 0 00.258.3h1.974l.497-3.148-.015.098a.435.435 0 01.43-.366h.896c1.759 0 3.136-.714 3.538-2.78.012-.062.022-.122.031-.18-.045-.024-.045-.024 0 0 .119-.773.001-1.298-.404-1.775-.448-.522-1.256-.762-2.31-.562h-3.195z" fill="#003087"/>
        <path d="M17.62 9.47a.38.38 0 00-.375.321l-.954 6.04.498-3.148a.435.435 0 01.43-.366h.896c1.759 0 3.136-.714 3.538-2.78.012-.062.022-.122.031-.18a2.753 2.753 0 00-.453-.14c-.427-.097-.9-.147-1.41-.147h-2.2v.4z" fill="#012169"/>
      </svg>
      {/* Apple Pay */}
      <svg width="38" height="24" viewBox="0 0 38 24" aria-label="Apple Pay" role="img" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.6 }}>
        <rect width="38" height="24" rx="3" fill="#000"/>
        <path d="M14.093 8.4c-.317.38-.825.678-1.333.636-.063-.508.186-1.048.476-1.382.317-.393.876-.667 1.327-.688.054.527-.153 1.044-.47 1.434zm.463.73c-.736-.042-1.364.418-1.714.418-.357 0-.895-.397-1.481-.386-.762.011-1.468.443-1.856 1.13-.794 1.37-.208 3.402.563 4.516.376.551.826 1.156 1.418 1.135.563-.021.782-.366 1.468-.366.685 0 .882.366 1.48.355.612-.01 1-.553 1.376-1.104.43-.627.607-1.235.618-1.267-.01-.011-1.193-.46-1.204-1.82-.011-1.137.929-1.683.97-1.705a2.11 2.11 0 00-1.638-.906zm4.346-1.578v8.314h1.29v-2.838h1.787c1.635 0 2.782-1.12 2.782-2.744 0-1.625-1.126-2.732-2.74-2.732h-3.12zm1.29 1.083h1.488c1.12 0 1.759.6 1.759 1.656 0 1.055-.638 1.66-1.763 1.66h-1.484V8.635zm6.874 7.306c.808 0 1.556-.409 1.896-1.058h.026v.993h1.194V11.85c0-1.198-.958-1.97-2.43-1.97-1.366 0-2.378.782-2.417 1.856h1.161c.1-.511.574-.846 1.22-.846.788 0 1.23.367 1.23 1.044v.457l-1.608.097c-1.494.09-2.303.703-2.303 1.766 0 1.073.836 1.686 2.031 1.686zm.348-1.002c-.688 0-1.126-.33-1.126-.836 0-.522.421-.825 1.226-.872l1.43-.087v.468c0 .769-.653 1.327-1.53 1.327zm4.565 3.228c1.259 0 1.852-.481 2.37-1.937l2.27-6.36h-1.312l-1.519 4.907h-.026l-1.52-4.907h-1.354l2.196 6.08-.118.37c-.197.628-.517.87-1.09.87-.101 0-.298-.01-.378-.02v1.01c.073.016.357.037.481.037v-.05z" fill="#fff"/>
      </svg>
      {/* Google Pay */}
      <svg width="38" height="24" viewBox="0 0 38 24" aria-label="Google Pay" role="img" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.6 }}>
        <rect width="38" height="24" rx="3" fill="#fff" stroke="#E6E6E6"/>
        <path d="M18.24 12.38v2.3h-.73v-5.7h1.93c.48 0 .89.16 1.22.48.34.32.51.71.51 1.17 0 .47-.17.86-.51 1.17-.33.32-.74.47-1.22.47h-1.2v.11zm0-2.76v2.07h1.22c.28 0 .52-.1.7-.29.19-.19.29-.43.29-.74 0-.3-.1-.54-.29-.73-.18-.19-.42-.29-.7-.29h-1.22v-.02zM22.4 10.96c.52 0 .94.14 1.24.42.3.28.45.66.45 1.15v2.32h-.7v-.52h-.03c-.29.43-.68.64-1.17.64-.42 0-.77-.12-1.04-.37-.28-.25-.42-.56-.42-.92 0-.39.15-.7.44-.92.29-.22.68-.33 1.17-.33.42 0 .76.08 1.03.23v-.16c0-.25-.09-.45-.28-.61-.19-.16-.42-.24-.68-.24-.39 0-.7.17-.93.5l-.64-.4c.35-.52.87-.79 1.56-.79zm-.93 2.73c0 .18.08.33.24.45.16.12.34.18.54.18.29 0 .55-.11.76-.33.22-.22.33-.47.33-.76-.2-.16-.49-.24-.86-.24-.27 0-.5.06-.68.19-.18.13-.27.3-.27.5l-.06.01zM27.55 11.08l-2.43 5.59h-.75l.9-1.95-1.6-3.64h.79l1.14 2.75h.02l1.11-2.75h.82z" fill="#3C4043"/>
        <path d="M15.07 12.17c0-.24-.02-.47-.06-.69h-3.2v1.31h1.84c-.08.42-.31.78-.66 1.02v.85h1.07c.63-.58.99-1.44.99-2.44l.02-.05z" fill="#4285F4"/>
        <path d="M11.81 15.54c.92 0 1.7-.31 2.26-.83l-1.07-.85c-.3.2-.69.32-1.19.32-.91 0-1.68-.62-1.96-1.45H8.76v.87c.56 1.11 1.71 1.94 3.05 1.94z" fill="#34A853"/>
        <path d="M9.85 12.73a2.4 2.4 0 010-1.52v-.87H8.76a3.97 3.97 0 000 3.26l1.09-.87z" fill="#FBBC04"/>
        <path d="M11.81 9.76c.51 0 .97.18 1.33.53l1-.99A3.52 3.52 0 0011.81 8a3.97 3.97 0 00-3.05 1.94l1.09.87c.28-.84 1.05-1.05 1.96-1.05z" fill="#EA4335"/>
      </svg>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="footer">
      {/* Top: social icons */}
      <div className="footer__content-top">
        <p className="footer__social-headline">Follow me on social media</p>
        <div className="footer__social-links">
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="footer__social-link"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom: payment icons + copyright + policies */}
      <div className="footer__content-bottom">
        <PaymentIcons />
        <div className="footer__copyright-row">
          <p className="footer__copyright">
            <Link href="/" style={{ color: 'inherit' }}>© 2026, George Gagoshidze</Link>
          </p>
          <nav className="footer__policy-links" aria-label="Legal">
            {POLICY_LINKS.map((p) => (
              <Link key={p.href} href={p.href} className="footer__policy-link">
                {p.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
