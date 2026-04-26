import { Link } from 'react-router-dom'

import { buildImageUrl } from '../content'
import type { Collection } from '../types/content'
import ImageWithFallback from './ImageWithFallback'

type CollectionCardProps = {
  collection: Collection
}

function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <article className="collection-card">
      <Link to={`/collections/${collection.slug}`} className="collection-card__link">
        <ImageWithFallback
          className="collection-card__image"
          src={buildImageUrl(collection.coverImage)}
          alt={collection.title}
          fallbackClassName="collection-card__placeholder"
        />
        <div className="collection-card__body">
          <h3>{collection.title}</h3>
          <p>{collection.description}</p>
        </div>
      </Link>
    </article>
  )
}

export default CollectionCard
