export default function AboutPage() {
  return (
    <div className="page-width" style={{ padding: '4rem 0 6rem', maxWidth: '72rem' }}>
      <h1 style={{ marginBottom: '3.2rem' }}>About</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', opacity: 0.85 }}>
        <p>
          George Gagoshidze is a Georgian artist based in Tbilisi. His practice spans painting,
          drawing, and mixed media, engaging deeply with themes of memory, identity, and place.
        </p>
        <p>
          Drawing on the rich cultural and historical heritage of Georgia, Gagoshidze&apos;s work
          explores the tension between tradition and contemporary experience. His paintings are
          characterised by a restrained palette, expressive mark-making, and a meditative quality
          that invites slow looking.
        </p>
        <p>
          Gagoshidze has exhibited widely across Europe and the Caucasus region. His work is held
          in private and public collections internationally.
        </p>
        <p>
          For enquiries about available works, commissions, or exhibitions, please use the{' '}
          <a href="/contact" className="link link--text">
            contact form
          </a>
          .
        </p>
      </div>
    </div>
  )
}
