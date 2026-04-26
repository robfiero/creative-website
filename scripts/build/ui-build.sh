#!/usr/bin/env bash
# Build the Vite frontend app.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"
cd "${ROOT_DIR}"

echo "→ Installing dependencies..."
npm ci

echo "→ Building frontend..."
npm run build

echo "✓ Frontend built to dist/"
