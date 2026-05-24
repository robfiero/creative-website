import { useState } from 'react'

type ImageWithFallbackProps = {
  className: string
  src: string
  alt: string
  fallbackClassName: string
  fallbackText?: string
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void
}

function ImageWithFallback({
  className,
  src,
  alt,
  fallbackClassName,
  fallbackText = 'Image unavailable',
  onLoad,
}: ImageWithFallbackProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const hasError = failedSrc === src

  if (hasError) {
    return <div className={fallbackClassName}>{fallbackText}</div>
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailedSrc(src)}
      onLoad={onLoad}
    />
  )
}

export default ImageWithFallback
