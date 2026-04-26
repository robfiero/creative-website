import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'

import ImageWithFallback from '../components/ImageWithFallback'
import { buildImageUrl, findPieceBySlug } from '../content'
import type { PieceVariant } from '../types/content'

function PiecePage() {
  const { slug } = useParams<{ slug: string }>()
  const [searchParams] = useSearchParams()
  const piece = findPieceBySlug(slug ?? '')
  const variantFromQuery = searchParams.get('variant')

  const variantsForStrip: PieceVariant[] = useMemo(() => {
    if (!piece) {
      return []
    }
    return piece.variants
  }, [piece])

  const defaultSelectedImage = useMemo(() => {
    if (!piece) {
      return ''
    }

    if (variantFromQuery && piece.variants.some((variant) => variant.image === variantFromQuery)) {
      return variantFromQuery
    }

    const primaryInVariants = piece.variants.find((variant) => variant.image === piece.primaryImage)

    if (primaryInVariants) {
      return primaryInVariants.image
    }

    return piece.variants[0]?.image ?? piece.primaryImage
  }, [piece, variantFromQuery])

  const [selectedImageByContext, setSelectedImageByContext] = useState<Record<string, string>>({})
  const selectionContextKey = `${piece?.slug ?? ''}:${variantFromQuery ?? ''}`
  const userSelectedImage = selectedImageByContext[selectionContextKey] ?? null

  const selectedImage =
    userSelectedImage && variantsForStrip.some((variant) => variant.image === userSelectedImage)
      ? userSelectedImage
      : defaultSelectedImage
  const selectedVariantLabel =
    piece?.variants.find((variant) => variant.image === selectedImage)?.label ?? 'Primary'

  if (!piece) {
    return (
      <section className="not-found">
        <h1>Piece not found</h1>
        <p>We could not find a piece for this URL.</p>
        <p>
          <Link to="/collections/all">Back to all collections</Link>
        </p>
      </section>
    )
  }

  return (
    <section
      className={`piece-page ${variantsForStrip.length <= 1 ? 'piece-page--single-variant' : ''}`}
      aria-labelledby="piece-title"
    >
      <div className="piece-page__layout">
        <div className="piece-page__gallery">
          <div className="piece-page__main-image-frame">
            <div className="piece-page__main-image-stage">
              <ImageWithFallback
                key={selectedImage}
                className="piece-page__main-image"
                src={buildImageUrl(selectedImage)}
                alt={piece.title}
                fallbackClassName="piece-page__main-image piece-page__main-placeholder"
              />
            </div>
          </div>

          {variantsForStrip.length > 1 ? (
            <div className="piece-page__thumbnails" aria-label="Variant thumbnails">
              {variantsForStrip.map((variant) => {
                const isActive = variant.image === selectedImage

                return (
                  <button
                    key={`${variant.label}-${variant.image}`}
                    type="button"
                    className={`piece-page__thumbnail ${isActive ? 'is-active' : ''}`}
                    onClick={() =>
                      setSelectedImageByContext((current) => ({
                        ...current,
                        [selectionContextKey]: variant.image,
                      }))
                    }
                    aria-label={`Show variant: ${variant.label}`}
                    aria-pressed={isActive}
                  >
                    <ImageWithFallback
                      className="piece-page__thumbnail-image"
                      src={buildImageUrl(variant.image)}
                      alt={variant.label}
                      fallbackClassName="piece-page__thumbnail-image piece-page__thumbnail-placeholder"
                      fallbackText=""
                    />
                  </button>
                )
              })}
            </div>
          ) : null}
        </div>

        <div className="piece-page__details">
          <h1 id="piece-title">{piece.title}</h1>
          <p className="piece-page__variant-label">{selectedVariantLabel}</p>
          <p className="piece-page__description">{piece.description}</p>

          <ul className="piece-page__tags" aria-label="Tags">
            {piece.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>

          <p className="piece-page__back-link-wrap">
            <Link to="/collections/all" className="piece-page__back-link">
              <span aria-hidden="true">←</span>
              Back to all collections
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export default PiecePage
