#!/usr/bin/env bash
# Sync built frontend to S3.
# Usage: ui-deploy-s3.sh <S3_BUCKET>
set -euo pipefail

S3_BUCKET="${1:-}"
if [[ -z "${S3_BUCKET}" ]]; then
  echo "Usage: $(basename "$0") <S3_BUCKET>"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"
DIST_DIR="${ROOT_DIR}/dist"

if [[ ! -d "${DIST_DIR}" ]]; then
  echo "Error: dist directory not found at ${DIST_DIR}. Run scripts/build/ui-build.sh first."
  exit 1
fi

echo "→ Syncing frontend to s3://${S3_BUCKET}/..."
aws s3 sync "${DIST_DIR}/" "s3://${S3_BUCKET}/" --delete

echo "✓ Frontend deployed to s3://${S3_BUCKET}/"
