#!/usr/bin/env bash
##############################################################
# scripts/smoke_test.sh
# Smoke tests against the live deployed application.
# Tests the actual FastAPI endpoints that exist in the codebase:
#   GET  /health
#   POST /v1/agent/generate
#   GET  /v1/agent/status
#   GET  /v1/agent/status/{run_id}
#   GET  /v1/agent/status/nonexistent-id  (expects 404)
#
# Runs after health_check.sh. Exits 1 on any failure.
##############################################################
set -euo pipefail

LOG_PREFIX="[smoke_test]"

# Target: Nginx reverse-proxies /v1/ and /health to the backend
BASE_URL="${SMOKE_TEST_BASE_URL:-http://localhost}"

PASS=0
FAIL=0

log()  { echo "${LOG_PREFIX} [INFO]  $*"; }
pass() { echo "${LOG_PREFIX} [PASS]  $*"; PASS=$((PASS + 1)); }
fail() { echo "${LOG_PREFIX} [FAIL]  $*" >&2; FAIL=$((FAIL + 1)); }

# ── Helper ────────────────────────────────────────────────
assert_status() {
    local desc="$1"
    local expected="$2"
    local actual="$3"
    if [[ "${actual}" == "${expected}" ]]; then
        pass "${desc} → HTTP ${actual}"
    else
        fail "${desc} → expected HTTP ${expected}, got HTTP ${actual}"
    fi
}

# ── Test 1: Frontend SPA loads ────────────────────────────
log "Test 1: Frontend SPA root"
STATUS=$(curl -sf -o /dev/null -w "%{http_code}" "${BASE_URL}/" || echo "000")
assert_status "GET /" "200" "${STATUS}"

# ── Test 2: Backend health endpoint via Nginx proxy ───────
log "Test 2: Backend health via proxy"
BODY=$(curl -sf "${BASE_URL}/health" || echo "{}")
STATUS=$(curl -sf -o /dev/null -w "%{http_code}" "${BASE_URL}/health" || echo "000")
assert_status "GET /health" "200" "${STATUS}"
if echo "${BODY}" | grep -q '"status":"ok"'; then
    pass "GET /health body contains status:ok"
else
    fail "GET /health body missing status:ok — got: ${BODY}"
fi

# ── Test 3: POST /v1/agent/generate returns 202 + queued ─
log "Test 3: POST /v1/agent/generate"
RESPONSE=$(curl -sf -X POST "${BASE_URL}/v1/agent/generate" \
    -H "Content-Type: application/json" \
    -d '{"company_name": "SmokeTestCorp"}' || echo "{}")
STATUS=$(curl -sf -o /dev/null -w "%{http_code}" -X POST "${BASE_URL}/v1/agent/generate" \
    -H "Content-Type: application/json" \
    -d '{"company_name": "SmokeTestCorp"}' || echo "000")
assert_status "POST /v1/agent/generate" "202" "${STATUS}"

# Extract run_id for subsequent tests
RUN_ID=$(echo "${RESPONSE}" | grep -o '"run_id":"[^"]*"' | cut -d'"' -f4 || echo "")
if [[ -n "${RUN_ID}" ]]; then
    pass "POST /v1/agent/generate returned run_id: ${RUN_ID}"
else
    fail "POST /v1/agent/generate response missing run_id — got: ${RESPONSE}"
fi

# ── Test 4: GET /v1/agent/status (list) ───────────────────
log "Test 4: GET /v1/agent/status (list all runs)"
STATUS=$(curl -sf -o /dev/null -w "%{http_code}" "${BASE_URL}/v1/agent/status" || echo "000")
assert_status "GET /v1/agent/status" "200" "${STATUS}"

# ── Test 5: GET /v1/agent/status/{run_id} ─────────────────
if [[ -n "${RUN_ID}" ]]; then
    log "Test 5: GET /v1/agent/status/${RUN_ID}"
    STATUS=$(curl -sf -o /dev/null -w "%{http_code}" "${BASE_URL}/v1/agent/status/${RUN_ID}" || echo "000")
    assert_status "GET /v1/agent/status/{run_id}" "200" "${STATUS}"
fi

# ── Test 6: 404 on unknown run_id ─────────────────────────
log "Test 6: GET /v1/agent/status/nonexistent-run-id"
STATUS=$(curl -sf -o /dev/null -w "%{http_code}" "${BASE_URL}/v1/agent/status/nonexistent-run-id-xyz" || echo "000")
assert_status "GET /v1/agent/status/nonexistent" "404" "${STATUS}"

# ── Test 7: Empty company_name rejected (422) ─────────────
log "Test 7: POST /v1/agent/generate with empty company_name"
STATUS=$(curl -sf -o /dev/null -w "%{http_code}" -X POST "${BASE_URL}/v1/agent/generate" \
    -H "Content-Type: application/json" \
    -d '{"company_name": ""}' || echo "000")
assert_status "POST /v1/agent/generate (empty name)" "422" "${STATUS}"

# ── Summary ───────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════"
echo "  Smoke Test Results: ${PASS} passed | ${FAIL} failed"
echo "═══════════════════════════════════════════"

if [[ ${FAIL} -gt 0 ]]; then
    echo "${LOG_PREFIX} ❌ Smoke tests FAILED."
    exit 1
fi

echo "${LOG_PREFIX} ✅ All smoke tests PASSED."
exit 0
