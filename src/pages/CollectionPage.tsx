import { Link, Navigate, useParams } from 'react-router-dom'

import PieceTile from '../components/PieceTile'
import { findCollectionBySlug, getPiecesForCollection } from '../content'

function CollectionPage() {
  const { slug } = useParams<{ slug: string }>()

  if (!slug) {
    return <Navigate to="/" replace />
  }

  const collection = findCollectionBySlug(slug)

  if (!collection) {
    return (
      <section className="not-found">
        <h1>Collection not found</h1>
        <p>We could not find a collection for this URL.</p>
        <p>
          <Link to="/">Return home</Link>
        </p>
      </section>
    )
  }

  const matchingCards = getPiecesForCollection(collection)

  return (
    <section className="collection-page" aria-labelledby="collection-heading">
      <header className="collection-page__header">
        <p className="collection-page__kicker">Collection</p>
        <h1 id="collection-heading">{collection.title}</h1>
        <p className="collection-page__description">{collection.description}</p>
        <p className="collection-page__back-link-wrap">
          <Link to="/" className="collection-page__back-link">
            <span aria-hidden="true">←</span>
            Back home
          </Link>
        </p>
      </header>

      <div className={`pieces-grid ${matchingCards.length === 1 ? 'pieces-grid--single' : ''}`}>
        {matchingCards.map(({ piece, displayImage, selectedVariantImage }) => (
          <PieceTile
            key={piece.slug}
            piece={piece}
            displayImage={displayImage}
            selectedVariantImage={selectedVariantImage}
          />
        ))}
      </div>
    </section>
  )
}

export default CollectionPage
