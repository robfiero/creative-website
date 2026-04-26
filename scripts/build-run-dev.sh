#!/usr/bin/env bash
# Install dependencies, run basic checks, then start Vite dev server.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${ROOT_DIR}"

step() { printf '\n▶ %s\n' "$*"; }
success() { printf '✓ %s\n' "$*"; }

step "Installing dependencies"
npm install
success "Dependencies installed"

step "Running lint"
npm run lint
success "Lint passed"

step "Starting dev server"
echo "Frontend: http://localhost:5173"
npm run dev
