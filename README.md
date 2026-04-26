# Creative Website

Static creative portfolio site built with Vite + React + TypeScript.

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- YAML content files (`yaml` parser)

## Routes

- `/` - Home
- `/about` - About the Artist
- `/collections/:slug` - Collection listing page
- `/piece/:slug` - Piece detail page

## Content Model

Content is YAML-driven from the `content/` directory:

- `content/collections.yaml`
- `content/pieces.yaml`

### Collections

Each collection includes:

- `title`
- `slug`
- `description`
- `coverImage`
- `tags`

### Pieces

Each top-level piece represents one subject/location and includes:

- `title`
- `slug`
- `description`
- `primaryImage`
- `tags` (subject/location/category tags)
- `variants[]`

Each variant includes:

- `label`
- `image`
- optional `tags` (style tags such as `watercolor`, `charcoal`, `black-and-white`, etc.)

## Variant-Aware Collection Behavior

Collection pages are variant-aware:

- If collection tags match top-level piece tags, the card shows the piece `primaryImage`.
- If collection tags match variant tags, the card shows the first matching variant image.
- Clicking a variant-matched card links to detail with a query parameter, for example:
  - `/piece/hollis-nh-library?variant=hollis-nh-library__charcoal.png`
- Piece detail pages read `?variant=` on load and open with that variant selected when valid.
- Invalid or missing variant query values safely fall back to normal default selection behavior.

## Images

All image paths are resolved from:

- `public/images/`

Important files currently referenced by the app:

- `public/images/signature.png` (header logo)
- `public/images/hero-collage-desktop.png` (home hero)
- `public/images/headshot.jpg` (About page; placeholder shown when missing)
- all piece/variant image files referenced in YAML

## Scripts

Core scripts:

- `npm run dev` - start local dev server
- `npm run build` - typecheck + production build (`tsc -b && vite build`)
- `npm run lint` - run ESLint
- `npm run preview` - preview production build

Local workflow helpers:

- `npm run scripts:check` - install, lint, build, optional tests
- `npm run scripts:dev` - install, lint, then start dev

AWS UI release helper:

- `npm run release:ui`

## `scripts/` Framework

Included script structure:

- `scripts/build-and-test.sh`
- `scripts/build-run-dev.sh`
- `scripts/build/ui-build.sh`
- `scripts/deploy/ui-deploy-s3.sh`
- `scripts/deploy/ui-cloudfront-invalidate.sh`
- `scripts/release-ui.sh`
- `scripts/env/prod.env.example`

### AWS release setup

1. Copy `scripts/env/prod.env.example` to `scripts/env/prod.local.env`
2. Set values:
   - `AWS_REGION`
   - `S3_BUCKET_UI`
   - `CLOUDFRONT_DISTRIBUTION_ID`
   - `UI_DOMAIN` (optional)
3. Configure AWS credentials
4. Run `npm run release:ui`

## Local Development

1. Install dependencies:
   - `npm install`
2. Start dev server:
   - `npm run dev`
3. Open:
   - `http://localhost:5173`

## Notes

- No backend/App Runner service is implemented in this repo today; this is a static frontend app.
- Keep `scripts/env/prod.local.env` out of source control (`.gitignore` already includes it).
