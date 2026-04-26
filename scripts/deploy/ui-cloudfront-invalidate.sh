#!/usr/bin/env bash
# Invalidate CloudFront cache after frontend deploy.
# Usage: ui-cloudfront-invalidate.sh <DISTRIBUTION_ID>
set -euo pipefail

DISTRIBUTION_ID="${1:-}"
if [[ -z "${DISTRIBUTION_ID}" ]]; then
  echo "Usage: $(basename "$0") <DISTRIBUTION_ID>"
  exit 1
fi

echo "→ Invalidating CloudFront distribution ${DISTRIBUTION_ID}..."
aws cloudfront create-invalidation --distribution-id "${DISTRIBUTION_ID}" --paths "/*" >/dev/null

echo "✓ Invalidation submitted."
