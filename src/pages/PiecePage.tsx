import { useCallback, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'

import ImageWithFallback from '../components/ImageWithFallback'
import { buildImageUrl, findPieceBySlug } from '../content'
import type { PieceVariant } from '../types/content'

type SelectedView =
  | {
      type: 'primary'
      id: string
      image: string
      label: string
      description: string
    }
  | {
      type: 'variant'
      id: string
      image: string
      label: string
      description: string
    }
  | {
      type: 'source'
      id: string
      image: string
      label: string
      description: string
    }

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

  const sourceViews: SelectedView[] = useMemo(() => {
    if (!piece?.original) {
      return []
    }

    return [
      {
        type: 'source',
        id: 'source:original',
        image: piece.original.image,
        label: 'Original Photo',
        description: piece.original.description,
      },
    ]
  }, [piece])

  const viewById = useMemo(() => {
    const views = new Map<string, SelectedView>()

    if (!piece) {
      return views
    }

    views.set(`primary:${piece.primaryImage}`, {
      type: 'primary',
      id: `primary:${piece.primaryImage}`,
      image: piece.primaryImage,
      label: 'Primary',
      description: piece.description,
    })

    for (const variant of piece.variants) {
      views.set(`variant:${variant.image}`, {
        type: 'variant',
        id: `variant:${variant.image}`,
        image: variant.image,
        label: variant.label,
        description: piece.description,
      })
    }

    for (const sourceView of sourceViews) {
      views.set(sourceView.id, sourceView)
    }

    return views
  }, [piece, sourceViews])

  const defaultSelectedViewId = useMemo(() => {
    if (!piece) {
      return ''
    }

    if (variantFromQuery && piece.variants.some((variant) => variant.image === variantFromQuery)) {
      return `variant:${variantFromQuery}`
    }

    const primaryInVariants = piece.variants.find((variant) => variant.image === piece.primaryImage)

    if (primaryInVariants) {
      return `variant:${primaryInVariants.image}`
    }

    return `primary:${piece.primaryImage}`
  }, [piece, variantFromQuery])

  const [selectedViewByContext, setSelectedViewByContext] = useState<Record<string, string>>({})
  const [mainImageIsPortrait, setMainImageIsPortrait] = useState(false)

  const handleMainImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    setMainImageIsPortrait(img.naturalHeight > img.naturalWidth)
  }, [])
  const selectionContextKey = `${piece?.slug ?? ''}:${variantFromQuery ?? ''}`
  const userSelectedViewId = selectedViewByContext[selectionContextKey] ?? null

  const selectedView =
    (userSelectedViewId ? viewById.get(userSelectedViewId) : undefined) ??
    viewById.get(defaultSelectedViewId)
  const selectedImage = selectedView?.image ?? piece?.primaryImage ?? ''
  const selectedViewLabel = selectedView?.label ?? 'Primary'
  const selectedDescription = selectedView?.description ?? piece?.description ?? ''

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
        <div className={`piece-page__gallery${mainImageIsPortrait ? ' piece-page__gallery--portrait' : ''}`}>
          <div className="piece-page__main-image-frame">
            <div className="piece-page__main-image-stage">
              <ImageWithFallback
                key={selectedImage}
                className="piece-page__main-image"
                src={buildImageUrl(selectedImage)}
                alt={piece.title}
                fallbackClassName="piece-page__main-image piece-page__main-placeholder"
                onLoad={handleMainImageLoad}
              />
            </div>
          </div>

          {variantsForStrip.length > 0 ? (
            <section className="piece-page__view-group" aria-labelledby="piece-artwork-styles-title">
              <h2 id="piece-artwork-styles-title">Artwork Styles</h2>
              <div className="piece-page__thumbnails" aria-label="Artwork style thumbnails">
                {variantsForStrip.map((variant) => {
                  const viewId = `variant:${variant.image}`
                  const isActive = selectedView?.id === viewId

                  return (
                    <button
                      key={`${variant.label}-${variant.image}`}
                      type="button"
                      className={`piece-page__thumbnail ${isActive ? 'is-active' : ''}`}
                      onClick={() =>
                        setSelectedViewByContext((current) => ({
                          ...current,
                          [selectionContextKey]: viewId,
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
            </section>
          ) : null}

          {sourceViews.length > 0 ? (
            <section className="piece-page__view-group piece-page__view-group--source" aria-labelledby="piece-source-title">
              <h2 id="piece-source-title">Source</h2>
              <div className="piece-page__thumbnails" aria-label="Source thumbnails">
                {sourceViews.map((sourceView) => {
                  const isActive = selectedView?.id === sourceView.id

                  return (
                    <button
                      key={sourceView.id}
                      type="button"
                      className={`piece-page__thumbnail ${isActive ? 'is-active' : ''}`}
                      onClick={() =>
                        setSelectedViewByContext((current) => ({
                          ...current,
                          [selectionContextKey]: sourceView.id,
                        }))
                      }
                      aria-label={`Show source: ${sourceView.label}`}
                      aria-pressed={isActive}
                    >
                      <ImageWithFallback
                        className="piece-page__thumbnail-image"
                        src={buildImageUrl(sourceView.image)}
                        alt={sourceView.label}
                        fallbackClassName="piece-page__thumbnail-image piece-page__thumbnail-placeholder"
                        fallbackText=""
                      />
                    </button>
                  )
                })}
              </div>
            </section>
          ) : null}
        </div>

        <div className="piece-page__details">
          <h1 id="piece-title">{piece.title}</h1>
          <p className="piece-page__variant-label">{selectedViewLabel}</p>
          <p className="piece-page__description">{selectedDescription}</p>

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
