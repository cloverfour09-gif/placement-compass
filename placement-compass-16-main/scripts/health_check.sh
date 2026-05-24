#!/usr/bin/env bash
##############################################################
# scripts/health_check.sh
# Verifies that all Docker containers are running and healthy.
# Exits with code 1 if any container is not healthy.
##############################################################
set -euo pipefail

LOG_PREFIX="[health_check]"
DEPLOY_PATH="${DEPLOY_PATH:-/opt/placement-compass}"
MAX_WAIT=60    # seconds to wait for containers to become healthy

log()  { echo "${LOG_PREFIX} [INFO]  $*"; }
err()  { echo "${LOG_PREFIX} [ERROR] $*" >&2; exit 1; }

# ── Helper: wait for a container to report 'healthy' ─────
wait_for_healthy() {
    local container="$1"
    local elapsed=0

    log "Waiting for '${container}' to become healthy (max ${MAX_WAIT}s)..."

    while [[ ${elapsed} -lt ${MAX_WAIT} ]]; do
        STATUS=$(docker inspect --format '{{.State.Health.Status}}' "${container}" 2>/dev/null || echo "not_found")

        case "${STATUS}" in
            healthy)
                log "✅ ${container} is healthy."
                return 0
                ;;
            unhealthy)
                err "❌ Container '${container}' is UNHEALTHY."
                ;;
            not_found)
                err "❌ Container '${container}' does not exist."
                ;;
            *)
                # starting | none
                sleep 5
                elapsed=$((elapsed + 5))
                ;;
        esac
    done

    err "❌ Container '${container}' did not become healthy within ${MAX_WAIT}s."
}

# ── Check Docker service is running ───────────────────────
log "Checking Docker daemon is running..."
docker info > /dev/null 2>&1 || err "Docker daemon is not running!"

# ── Check backend container ───────────────────────────────
wait_for_healthy "placement_compass_backend"

# ── Check frontend container ──────────────────────────────
wait_for_healthy "placement_compass_frontend"

# ── HTTP-level checks ─────────────────────────────────────
log "Checking backend HTTP health endpoint..."
BACKEND_STATUS=$(curl -sf -o /dev/null -w "%{http_code}" http://localhost:8000/health || echo "000")
if [[ "${BACKEND_STATUS}" != "200" ]]; then
    err "Backend /health returned HTTP ${BACKEND_STATUS} (expected 200)."
fi
log "✅ Backend /health → HTTP 200"

log "Checking frontend HTTP endpoint..."
FRONTEND_STATUS=$(curl -sf -o /dev/null -w "%{http_code}" http://localhost:80/ || echo "000")
if [[ "${FRONTEND_STATUS}" != "200" ]]; then
    err "Frontend / returned HTTP ${FRONTEND_STATUS} (expected 200)."
fi
log "✅ Frontend / → HTTP 200"

log "✅ All health checks passed."
