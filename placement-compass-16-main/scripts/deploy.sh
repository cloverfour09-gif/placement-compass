#!/usr/bin/env bash
##############################################################
# scripts/deploy.sh
# Idempotent deployment script — runs on the Ubuntu server.
#
# Expected environment variables (set by Jenkinsfile):
#   DOCKER_USER   – Docker Hub username
#   DOCKER_PASS   – Docker Hub password
#   IMAGE_TAG     – Git short SHA (e.g. a1b2c3d)
#   DEPLOY_PATH   – Absolute path on server (e.g. /opt/placement-compass)
##############################################################
set -euo pipefail

LOG_PREFIX="[deploy]"
TIMESTAMP=$(date '+%Y-%m-%dT%H:%M:%S')

log()  { echo "${LOG_PREFIX} [INFO]  $* (${TIMESTAMP})"; }
warn() { echo "${LOG_PREFIX} [WARN]  $*" >&2; }
err()  { echo "${LOG_PREFIX} [ERROR] $*" >&2; exit 1; }

# ── Validate required variables ───────────────────────────
: "${DOCKER_USER:?DOCKER_USER is not set}"
: "${DOCKER_PASS:?DOCKER_PASS is not set}"
: "${IMAGE_TAG:?IMAGE_TAG is not set}"
: "${DEPLOY_PATH:?DEPLOY_PATH is not set}"

# ── Ensure deployment directory exists ────────────────────
log "Ensuring deploy directory exists: ${DEPLOY_PATH}"
mkdir -p "${DEPLOY_PATH}"
cd "${DEPLOY_PATH}"

# ── Snapshot previous image tags for rollback ─────────────
PREVIOUS_FRONTEND=$(docker inspect --format '{{index .RepoTags 0}}' placement_compass_frontend 2>/dev/null || echo "none")
PREVIOUS_BACKEND=$(docker inspect  --format '{{index .RepoTags 0}}' placement_compass_backend  2>/dev/null || echo "none")

log "Previous frontend image: ${PREVIOUS_FRONTEND}"
log "Previous backend image : ${PREVIOUS_BACKEND}"

# Save previous tags so rollback.sh can use them
echo "PREVIOUS_FRONTEND=${PREVIOUS_FRONTEND}" > .rollback_state
echo "PREVIOUS_BACKEND=${PREVIOUS_BACKEND}"   >> .rollback_state
echo "DEPLOY_PATH=${DEPLOY_PATH}"             >> .rollback_state

# ── Docker Hub login ──────────────────────────────────────
log "Logging in to Docker Hub..."
echo "${DOCKER_PASS}" | docker login -u "${DOCKER_USER}" --password-stdin

# ── Pull latest images ────────────────────────────────────
log "Pulling frontend image: ${DOCKER_USER}/placement-compass-frontend:${IMAGE_TAG}"
docker pull "${DOCKER_USER}/placement-compass-frontend:${IMAGE_TAG}"

log "Pulling backend image: ${DOCKER_USER}/placement-compass-backend:${IMAGE_TAG}"
docker pull "${DOCKER_USER}/placement-compass-backend:${IMAGE_TAG}"

# ── Export IMAGE_TAG so docker-compose uses the correct tag ─
export DOCKER_HUB_USERNAME="${DOCKER_USER}"
export IMAGE_TAG="${IMAGE_TAG}"

# ── Deploy with Docker Compose ────────────────────────────
log "Starting services with Docker Compose (tag=${IMAGE_TAG})..."
docker compose -f docker-compose.yml up -d --remove-orphans

# ── Docker Hub logout ─────────────────────────────────────
docker logout
log "Docker Hub logout complete."

# ── Brief pause to allow containers to initialise ─────────
log "Waiting 15 seconds for services to initialise..."
sleep 15

log "✅ Deployment complete (tag=${IMAGE_TAG})."
