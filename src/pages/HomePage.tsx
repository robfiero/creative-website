import CollectionCard from '../components/CollectionCard'
import { siteContent } from '../content'

function HomePage() {
  const { collections } = siteContent.collectionsFile

  return (
    <div className="home-page">
      <section className="home-band home-band--hero">
        <div className="home-divider" aria-hidden="true" />
        <section className="hero hero--collage" aria-labelledby="hero-heading">
          <img
            className="hero__image"
            src="/images/hero-collage-desktop-v5.png"
            alt=""
            loading="eager"
            aria-hidden="true"
          />
          <div className="hero__overlay" aria-hidden="true" />
          <div className="hero__content">
            <p className="hero__kicker">Rob Fiero Creative</p>
            <h1 id="hero-heading">Creative Work</h1>
            <p>
              Reimagined views of familiar places, shaped by photography, memory, atmosphere, and
              visual experimentation.
            </p>
          </div>
        </section>
      </section>

      <section className="home-band home-band--collections">
        <div className="home-divider" aria-hidden="true" />
        <section className="collections" aria-labelledby="collections-heading">
          <div className="collections__header">
            <p className="section-eyebrow">Explore the Work</p>
            <h2 id="collections-heading">Collections</h2>
          </div>
          <div className="collections__grid">
            {collections.map((collection) => (
              <CollectionCard key={collection.slug} collection={collection} />
            ))}
          </div>
        </section>
      </section>

      <p className="home-note">
        Prints and similar merchandise may be available for sale. More information coming soon.
      </p>
    </div>
  )
}

export default HomePage
