import { Link } from 'react-router-dom'

import { buildImageUrl } from '../content'
import type { Piece } from '../types/content'
import ImageWithFallback from './ImageWithFallback'

type PieceTileProps = {
  piece: Piece
  displayImage?: string
  selectedVariantImage?: string
}

function PieceTile({ piece, displayImage, selectedVariantImage }: PieceTileProps) {
  const additionalVariantCount = Math.max(piece.variants.length - 1, 0)
  const imageToShow = displayImage ?? piece.primaryImage
  const pieceHref = selectedVariantImage
    ? `/piece/${piece.slug}?${new URLSearchParams({ variant: selectedVariantImage }).toString()}`
    : `/piece/${piece.slug}`

  return (
    <article className="piece-tile">
      <Link to={pieceHref} className="piece-tile__link" aria-label={piece.title}>
        <ImageWithFallback
          className="piece-tile__image"
          src={buildImageUrl(imageToShow)}
          alt={piece.title}
          fallbackClassName="piece-tile__placeholder"
        />

        {additionalVariantCount > 0 ? (
          <span
            className="piece-tile__badge"
            aria-label={`${additionalVariantCount} additional versions`}
            title={`${additionalVariantCount} additional versions`}
          >
            +{additionalVariantCount}
          </span>
        ) : null}

        <div className="piece-tile__title-overlay">
          <h3>{piece.title}</h3>
        </div>
      </Link>
    </article>
  )
}

export default PieceTile
