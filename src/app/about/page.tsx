import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="page-width" style={{ padding: '4rem 0 6rem' }}>

      {/* Bio */}
      <div className="about-bio">
        <div className="about-bio__image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://www.georgegagoshidze.com/cdn/shop/articles/14_86ebc361-1c03-4ded-92fb-daccc243196c.jpg?v=1773346980&width=1100"
            alt="George Gagoshidze"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div className="about-bio__text">
          <h1 style={{ marginBottom: '2.4rem' }}>About</h1>
          <p>
            George Gagoshidze is a Tbilisi-born visual artist whose work moves between abstract
            landscapes, sculptural painting, and politically charged contemporary art. His early
            practice explored atmosphere and form through layered, expressive compositions,
            gradually evolving into experiments with shaped plywood panels and works that blur
            the boundary between painting and object. Over the years, his visual language has
            expanded to address themes of power, memory, resistance, and identity — particularly
            in relation to Georgia and Ukraine. Without abandoning abstraction, Gagoshidze
            integrates symbolism, text, and historical references into bold, materially driven
            compositions.
          </p>
        </div>
      </div>

      {/* Journey */}
      <div className="about-journey">
        <h2 style={{ textAlign: 'center', marginBottom: '6rem' }}>
          A Journey Through Form, Memory, and Meaning (2010–2026)
        </h2>

        {/* 2021–2026 */}
        <div className="about-era">
          <div className="about-era__image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://cdn.shopify.com/s/files/1/0997/8783/3673/files/1_65708caa-496b-486f-a784-f2de3d8d19b5.jpg?v=1771096954"
              alt="Ukraine is Georgia is Ukraine"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div className="about-era__content">
            <h3>2021–2026: Ukraine is Georgia is Ukraine</h3>
            <p>
              In his most recent body of work, George&apos;s abstract language becomes fully
              engaged with the present moment. The series <em>Ukraine is Georgia is Ukraine</em>{' '}
              reflects intertwined histories, shared struggles and contemporary geopolitical
              realities. The work carries urgency. Gesture becomes statement. Colour becomes voice.
              This is not a departure from abstraction, it is its expansion. The same painterly
              confidence developed over the past decade now holds deeper conceptual resonance. The
              journey that began with mountains and memory arrives here, where abstraction meets
              history, solidarity, and lived experience. Art becomes both reflection and response.
            </p>
            <Link href="/collections/ukraine-is-georgia-is-ukraine" className="btn btn--outline about-era__link">
              Explore the project
            </Link>
          </div>
        </div>

        {/* 2019–2021 */}
        <div className="about-era about-era--reverse">
          <div className="about-era__image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://cdn.shopify.com/s/files/1/0997/8783/3673/files/3_46fa43ab-3a92-4502-94a3-1a5ad5493912.jpg?v=1771099858"
              alt="2019–2021 works"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div className="about-era__content">
            <h3>2019–2021: Abstraction with Emotional Pulse</h3>
            <p>
              Between 2019 and 2021, abstraction gains conceptual depth. Titles such as{' '}
              <em>Resistance</em>, <em>Rebellion</em>, and <em>Inner Anger</em> reveal a shift:
              these works carry emotional and psychological intensity. The surfaces feel charged.
              The compositions more structured. The tension more deliberate. Oil on plywood
              introduces physical weight and architectural presence. The paintings feel grounded,
              forceful. Not just expressive, but declarative. Abstraction becomes a vessel for
              inner and collective states.
            </p>
            <Link href="/collections/2019-2021" className="btn btn--outline about-era__link">
              Explore the project
            </Link>
          </div>
        </div>

        {/* 2016–2018 */}
        <div className="about-era">
          <div className="about-era__image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://cdn.shopify.com/s/files/1/0997/8783/3673/files/OilonCanvas.140X200cm.2018..jpg?v=1771173997"
              alt="2016–2018 works"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div className="about-era__content">
            <h3>2016–2018: Abstraction Takes Full Form</h3>
            <p>
              Between 2016 and 2018, abstraction is no longer an experiment — it becomes a fully
              realised language. Large oil paintings coexist with dynamic works on paper. Suggestion
              replaces depiction. Atmosphere replaces topography. The memory of landscape still
              lingers, but now as trace rather than subject: embedded in spatial tension, layered
              surfaces, and the rhythm of gesture. Across these years, the work grows bolder, more
              immersive, and more assured. In 2017, George&apos;s visual vocabulary crystallises
              into something unmistakably his own. By 2018, literal reference disappears almost
              entirely. Paint becomes terrain. Gesture becomes structure. The canvas is no longer a
              window onto the world, but a space of sensation, presence, and force. This is the
              period in which abstraction and memory fuse completely.
            </p>
            <Link href="/collections/2016-2018" className="btn btn--outline about-era__link">
              Explore the project
            </Link>
          </div>
        </div>

        {/* 2014–2015 */}
        <div className="about-era about-era--reverse">
          <div className="about-era__image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://cdn.shopify.com/s/files/1/0997/8783/3673/files/Pencil_watercolour_acrylic_on_paper_120_X_150_2015.jpg?v=1775561259"
              alt="2014–2015 works"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div className="about-era__content">
            <h3>2014–2015: Between Landscape and Abstraction</h3>
            <p>
              By 2014, the terrain begins to dissolve. Mountains soften into gestures. Horizons
              fragment into fields of color. Watercolour, acrylic, tempera, and pencil enter the
              practice more prominently. The canvas becomes less about depicting a place and more
              about evoking sensation. In 2015, this transition deepens. Landscapes are no longer
              literal. They are remembered, distilled, abstracted. Brushstrokes become freer.
              Composition becomes more daring. Space opens. This period represents a critical
              turning point: George is no longer painting what he sees — he is painting what he
              feels.
            </p>
            <Link href="/collections/2014-2015" className="btn btn--outline about-era__link">
              Explore the project
            </Link>
          </div>
        </div>

        {/* 2010–2013 */}
        <div className="about-era">
          <div className="about-era__image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://cdn.shopify.com/s/files/1/0997/8783/3673/files/fsdfasdf.jpg?v=1773348138"
              alt="2010–2013 works"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div className="about-era__content">
            <h3>2010–2013: The Landscape Years — Roots in Place</h3>
            <p>
              George Gagoshidze&apos;s early works are deeply rooted in landscape. Between 2010
              and 2013, mountains, terrain, and the vastness of Georgian nature form the visual
              foundation of his practice. These paintings are grounded in observation, yet already
              hint at something more intuitive beneath the surface. Oil on canvas dominates this
              period: textured skies, rugged horizons, layered earth tones. Even in these early
              works, however, the landscape is not merely topographical. It carries atmosphere,
              memory, and emotional weight. This is where the journey begins: with place, not as
              geography alone, but as lived experience.
            </p>
            <Link href="/collections/2010-2011" className="btn btn--outline about-era__link">
              Explore the project
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}
