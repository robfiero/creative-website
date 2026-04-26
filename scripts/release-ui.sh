#!/usr/bin/env bash
# Build and deploy frontend to AWS S3 + CloudFront.
# Usage: ./scripts/release-ui.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${ROOT_DIR}"

source "${SCRIPT_DIR}/env/prod.env.example"
[[ -f "${SCRIPT_DIR}/env/prod.local.env" ]] && source "${SCRIPT_DIR}/env/prod.local.env"

: "${AWS_REGION:?AWS_REGION is required}"
: "${S3_BUCKET_UI:?S3_BUCKET_UI is required}"
: "${CLOUDFRONT_DISTRIBUTION_ID:?CLOUDFRONT_DISTRIBUTION_ID is required}"

export AWS_REGION

echo "=== UI release ==="
echo "    Region    : ${AWS_REGION}"
echo "    S3 bucket : ${S3_BUCKET_UI}"
echo "    CloudFront: ${CLOUDFRONT_DISTRIBUTION_ID}"
echo

"${SCRIPT_DIR}/build/ui-build.sh"
"${SCRIPT_DIR}/deploy/ui-deploy-s3.sh" "${S3_BUCKET_UI}"
"${SCRIPT_DIR}/deploy/ui-cloudfront-invalidate.sh" "${CLOUDFRONT_DISTRIBUTION_ID}"

echo
echo "=== UI release complete ==="
