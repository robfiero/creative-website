#!/usr/bin/env bash
# Build checks for the frontend project, with optional tests if a test script exists.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${ROOT_DIR}"

pass() { echo "  ✓ $*"; }
fail() { echo "  ✗ $*"; }
section() {
  echo
  echo "══════════════════════════════════════════"
  echo "  $*"
  echo "══════════════════════════════════════════"
}

ERRORS=0

section "Installing dependencies"
if npm ci 2>&1; then
  pass "Dependencies installed"
else
  fail "Dependency installation failed"
  ERRORS=$((ERRORS + 1))
fi

section "Linting"
if npm run lint 2>&1; then
  pass "Lint passed"
else
  fail "Lint failed"
  ERRORS=$((ERRORS + 1))
fi

section "Build"
if npm run build 2>&1; then
  pass "Build passed"
else
  fail "Build failed"
  ERRORS=$((ERRORS + 1))
fi

section "Tests"
TEST_SCRIPT="$(npm pkg get scripts.test 2>/dev/null | tr -d '[:space:]')"
if [[ -n "${TEST_SCRIPT}" && "${TEST_SCRIPT}" != "{}" && "${TEST_SCRIPT}" != "null" ]]; then
  if npm run test 2>&1; then
    pass "Tests passed"
  else
    fail "Tests failed"
    ERRORS=$((ERRORS + 1))
  fi
else
  echo "  • No test script configured; skipping"
fi

echo
if [ "${ERRORS}" -eq 0 ]; then
  echo "  ✓ All checks passed"
else
  echo "  ✗ ${ERRORS} check(s) failed"
  exit 1
fi
