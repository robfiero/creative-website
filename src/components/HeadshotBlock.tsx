import { buildImageUrl } from '../content'
import ImageWithFallback from './ImageWithFallback'

type HeadshotBlockProps = {
  className?: string
}

function HeadshotBlock({ className }: HeadshotBlockProps) {
  return (
    <div className={className}>
      <ImageWithFallback
        className="headshot__image"
        src={buildImageUrl('headshot.jpg')}
        alt="Rob Fiero"
        fallbackClassName="headshot__placeholder"
        fallbackText=""
      />
    </div>
  )
}

export default HeadshotBlock
