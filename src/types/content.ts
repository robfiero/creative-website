export type Collection = {
  title: string
  slug: string
  description: string
  coverImage: string
  tags: string[]
}

export type PieceVariant = {
  label: string
  image: string
  tags?: string[]
}

export type Piece = {
  title: string
  slug: string
  description: string
  primaryImage: string
  tags: string[]
  variants: PieceVariant[]
}

export type CollectionPieceCard = {
  piece: Piece
  displayImage: string
  selectedVariantImage?: string
}

export type CollectionsFile = {
  collections: Collection[]
}

export type PiecesFile = {
  pieces: Piece[]
}
