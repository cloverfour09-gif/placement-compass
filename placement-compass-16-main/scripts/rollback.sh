#!/usr/bin/env bash
##############################################################
# scripts/rollback.sh
# Safe rollback — restores the previous Docker image versions.
#
# Reads .rollback_state written by deploy.sh.
# Expected environment variables:
#   DEPLOY_PATH – Absolute path on server (or reads from .rollback_state)
##############################################################
set -euo pipefail

LOG_PREFIX="[rollback]"
TIMESTAMP=$(date '+%Y-%m-%dT%H:%M:%S')

log()  { echo "${LOG_PREFIX} [INFO]  $* (${TIMESTAMP})"; }
warn() { echo "${LOG_PREFIX} [WARN]  $*" >&2; }
err()  { echo "${LOG_PREFIX} [ERROR] $*" >&2; exit 1; }

# ── Locate state file ─────────────────────────────────────
DEPLOY_PATH="${DEPLOY_PATH:-/opt/placement-compass}"
STATE_FILE="${DEPLOY_PATH}/.rollback_state"

if [[ ! -f "${STATE_FILE}" ]]; then
    err "Rollback state file not found at ${STATE_FILE}. Cannot roll back automatically."
fi

# Load previous image tags
source "${STATE_FILE}"

log "Rolling back to:"
log "  Frontend: ${PREVIOUS_FRONTEND}"
log "  Backend : ${PREVIOUS_BACKEND}"

cd "${DEPLOY_PATH}"

# ── Guard: if previous was 'none', abort rollback ─────────
if [[ "${PREVIOUS_FRONTEND}" == "none" || "${PREVIOUS_BACKEND}" == "none" ]]; then
    warn "No previous deployment found. Stopping current containers..."
    docker compose -f docker-compose.yml down || true
    err "No previous image to roll back to. Manual intervention required."
fi

# ── Re-tag the previous image as 'latest' ─────────────────
log "Re-tagging previous images as current..."
docker tag "${PREVIOUS_FRONTEND}" "$(echo "${PREVIOUS_FRONTEND}" | cut -d: -f1):latest" || warn "Could not re-tag frontend image"
docker tag "${PREVIOUS_BACKEND}"  "$(echo "${PREVIOUS_BACKEND}"  | cut -d: -f1):latest" || warn "Could not re-tag backend image"

# ── Restart services with the previous images ─────────────
log "Restarting services with previous images..."
export IMAGE_TAG="latest"
docker compose -f docker-compose.yml up -d --remove-orphans

sleep 10

log "✅ Rollback complete. Services restarted with previous images."
log "   Run 'bash ${DEPLOY_PATH}/health_check.sh' to verify."
