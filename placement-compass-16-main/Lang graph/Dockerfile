# ─────────────────────────────────────────────────────────
# Placement Compass – FastAPI + LangGraph Backend
# Base image: Python 3.12 slim (Debian-based, minimal footprint)
# ─────────────────────────────────────────────────────────
FROM python:3.12-slim AS base

# ── System layer ──────────────────────────────────────────
# Install only the OS packages we actually need
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        curl \
        gcc \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user for security
RUN groupadd --gid 1001 appgroup \
    && useradd --uid 1001 --gid appgroup --no-create-home appuser

# ── Dependency layer (cached separately from app code) ────
WORKDIR /app

# Copy only requirements first so this layer is re-used when
# source code changes but requirements don't
COPY requirements.txt .

# Install Python dependencies (no pip cache to keep image lean)
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# ── Application layer ─────────────────────────────────────
# Copy application source code AFTER dependencies to maximise cache hits
# We explicitly copy only what is needed for production runtime
COPY app/           ./app/
COPY graph.py       .
COPY main.py        .
COPY models.py      .
COPY nodes/         ./nodes/
COPY prompts.py     .
COPY schema.py      .
COPY state.py       .

# Fix ownership so the non-root user can write output files
RUN chown -R appuser:appgroup /app

# ── Runtime ───────────────────────────────────────────────
USER appuser

EXPOSE 8000

# Uvicorn is the ASGI server; host 0.0.0.0 is required inside Docker.
# 2 workers is a safe default for a single-core container.
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2", "--log-level", "info"]
