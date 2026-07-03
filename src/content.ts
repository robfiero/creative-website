import { parse } from 'yaml'

import collectionsYaml from '../content/collections.yaml?raw'
import piecesYaml from '../content/pieces.yaml?raw'
import type {
  Collection,
  CollectionPieceCard,
  CollectionsFile,
  Piece,
  PieceOriginal,
  PieceVariant,
  PiecesFile,
} from './types/content'

const IMAGES_BASE_PATH = '/images/'

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parseStringList(value: unknown): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    throw new Error('Expected string[]')
  }

  return value
}

function parseCollection(value: unknown, index: number): Collection {
  if (!isObject(value)) {
    throw new Error(`Invalid collections.yaml at collections[${index}]`)
  }

  const { title, slug, description, coverImage, tags } = value

  if (
    typeof title !== 'string' ||
    typeof slug !== 'string' ||
    typeof description !== 'string' ||
    typeof coverImage !== 'string'
  ) {
    throw new Error(`Invalid collections.yaml at collections[${index}]`)
  }

  return {
    title,
    slug,
    description,
    coverImage,
    tags: parseStringList(tags),
  }
}

function parsePieceVariant(value: unknown, pieceIndex: number, variantIndex: number): PieceVariant {
  if (!isObject(value) || typeof value.label !== 'string' || typeof value.image !== 'string') {
    throw new Error(`Invalid pieces.yaml at pieces[${pieceIndex}].variants[${variantIndex}]`)
  }

  const variant: PieceVariant = {
    label: value.label,
    image: value.image,
  }

  if (value.tags !== undefined) {
    variant.tags = parseStringList(value.tags)
  }

  return variant
}

function parsePieceOriginal(value: unknown, pieceIndex: number): PieceOriginal {
  if (!isObject(value) || typeof value.image !== 'string' || typeof value.description !== 'string') {
    throw new Error(`Invalid pieces.yaml at pieces[${pieceIndex}].original`)
  }

  return {
    image: value.image,
    description: value.description,
  }
}

function parsePiece(value: unknown, index: number): Piece {
  if (!isObject(value)) {
    throw new Error(`Invalid pieces.yaml at pieces[${index}]`)
  }

  const { title, slug, description, primaryImage, tags, variants, original } = value

  if (
    typeof title !== 'string' ||
    typeof slug !== 'string' ||
    typeof description !== 'string' ||
    typeof primaryImage !== 'string' ||
    !Array.isArray(variants)
  ) {
    throw new Error(`Invalid pieces.yaml at pieces[${index}]`)
  }

  const piece: Piece = {
    title,
    slug,
    description,
    primaryImage,
    tags: parseStringList(tags),
    variants: variants.map((variant, variantIndex) =>
      parsePieceVariant(variant, index, variantIndex),
    ),
  }

  if (original !== undefined) {
    piece.original = parsePieceOriginal(original, index)
  }

  return piece
}

function parseCollectionsFile(yamlText: string): CollectionsFile {
  const parsed = parse(yamlText)

  if (!isObject(parsed) || !Array.isArray(parsed.collections)) {
    throw new Error('Invalid collections.yaml: expected top-level "collections" array.')
  }

  return {
    collections: parsed.collections.map((collection, index) => parseCollection(collection, index)),
  }
}

function parsePiecesFile(yamlText: string): PiecesFile {
  const parsed = parse(yamlText)

  if (!isObject(parsed) || !Array.isArray(parsed.pieces)) {
    throw new Error('Invalid pieces.yaml: expected top-level "pieces" array.')
  }

  return {
    pieces: parsed.pieces.map((piece, index) => parsePiece(piece, index)),
  }
}

export function buildImageUrl(filename: string): string {
  return `${IMAGES_BASE_PATH}${filename}`
}

export function loadContent(): { collectionsFile: CollectionsFile; piecesFile: PiecesFile } {
  return {
    collectionsFile: parseCollectionsFile(collectionsYaml),
    piecesFile: parsePiecesFile(piecesYaml),
  }
}

export const siteContent = loadContent()

export function findCollectionBySlug(slug: string): Collection | undefined {
  return siteContent.collectionsFile.collections.find((collection) => collection.slug === slug)
}

export function findPieceBySlug(slug: string): Piece | undefined {
  return siteContent.piecesFile.pieces.find((piece) => piece.slug === slug)
}

export function getPiecesForCollection(collection: Collection): CollectionPieceCard[] {
  const { pieces } = siteContent.piecesFile

  if (collection.tags.length === 0) {
    return pieces.map((piece) => ({
      piece,
      displayImage: piece.primaryImage,
    }))
  }

  return pieces.reduce<CollectionPieceCard[]>((cards, piece) => {
    const topLevelMatch = piece.tags.some((tag) => collection.tags.includes(tag))

    if (topLevelMatch) {
      cards.push({
        piece,
        displayImage: piece.primaryImage,
      })
      return cards
    }

    const firstMatchingVariant = piece.variants.find((variant) =>
      (variant.tags ?? []).some((tag) => collection.tags.includes(tag)),
    )

    if (firstMatchingVariant) {
      cards.push({
        piece,
        displayImage: firstMatchingVariant.image,
        selectedVariantImage: firstMatchingVariant.image,
      })
    }

    return cards
  }, [])
}
