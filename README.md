# Placement Compass — Full-Stack AI Placement Intelligence Platform

A production-ready, fully containerized full-stack application with a complete Jenkins CI/CD pipeline.

---

## Project Structure (Monorepo)

```
S50/                                        ← Git repository root
├── Jenkinsfile                             ← CI/CD pipeline (12 stages)
├── placement-compass-16-main/              ← Project root
│   ├── Dockerfile                          ← Frontend: Node 20 → Nginx Alpine
│   ├── nginx.conf                          ← SPA routing + FastAPI reverse proxy
│   ├── docker-compose.yml                  ← Orchestrates frontend + backend
│   ├── .env.example                        ← Environment variable reference
│   ├── .dockerignore                       ← Frontend Docker build context filter
│   ├── scripts/
│   │   ├── deploy.sh                       ← Idempotent deployment script
│   │   ├── rollback.sh                     ← Automatic rollback to previous images
│   │   ├── health_check.sh                 ← Container + HTTP health validation
│   │   └── smoke_test.sh                   ← 7 live endpoint smoke tests
│   ├── src/                                ← React + TypeScript frontend
│   └── Lang graph/                         ← FastAPI Backend + LangGraph Agent
│       ├── Dockerfile                      ← Backend: Python 3.12-slim + Uvicorn
│       ├── .dockerignore                   ← Backend Docker build context filter
│       ├── app/                            ← FastAPI application
│       │   ├── main.py                     ← FastAPI entry point (port 8000)
│       │   ├── routes/agent.py             ← API endpoints (/v1/agent/*)
│       │   ├── service.py                  ← WorkflowService (async run manager)
│       │   └── config/settings.py          ← Pydantic settings from .env
│       ├── graph.py                        ← LangGraph StateGraph definition
│       ├── main.py                         ← Multi-agent pipeline entry point
│       ├── schema.py                       ← 163-parameter golden record schema
│       ├── langgraph.json                  ← LangGraph Studio configuration
│       └── requirements.txt               ← Python dependencies
```

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| Backend API | FastAPI + Uvicorn (Python 3.12) |
| AI Agents | LangChain + LangGraph (multi-agent StateGraph) |
| LLM Providers | Groq (Llama) / GitHub GPT-4o / SambaNova — parallel |
| Observability | LangSmith tracing |
| Database | Supabase (hosted PostgreSQL) |
| Containerization | Docker + Docker Compose |
| Web Server | Nginx (Alpine) |
| CI/CD | Jenkins Declarative Pipeline |

---

## Jenkins Pipeline Stages

| Stage | Description |
|---|---|
| 1. Checkout | Clone repo, capture git commit SHA |
| 2. Frontend: Install Dependencies | `npm ci --frozen-lockfile` |
| 3. Backend: Install Dependencies | Python venv + `pip install -r requirements.txt` |
| 4. Frontend: Lint Validation | ESLint |
| 5. Frontend: Run Tests | Vitest |
| 6. Frontend: Build Application | `npm run build` → `dist/` |
| 7. Backend: Execute Tests | pytest |
| 8. **Agentic Orchestration: Validate & Initialize** | Validates langgraph.json, schema, AgentState, graph compilation, FastAPI routes, WorkflowService |
| 9. Frontend: Build Docker Image | Multi-stage Node→Nginx image, push to Docker Hub |
| 10. Backend: Build Docker Image | Python slim image, push to Docker Hub |
| 11. Deploy | SSH to Ubuntu server, docker compose up |
| 12. Health Check & Smoke Tests | 7 endpoint assertions; auto-rollback on failure |

---

## Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/SheethalGowdaJR/S50.git
cd S50
```

### 2. Configure environment variables
```bash
cp placement-compass-16-main/.env.example placement-compass-16-main/Lang\ graph/.env
# Edit .env and fill in your API keys
```

### 3. Run with Docker Compose
```bash
cd placement-compass-16-main
docker compose up -d
```

- **Frontend:** http://localhost:80
- **Backend API:** http://localhost:80/v1/agent/generate
- **API Docs:** http://localhost:80/docs

### 4. Run locally (without Docker)

**Frontend:**
```bash
cd placement-compass-16-main
npm install
npm run dev       # Starts at http://localhost:8080
```

**Backend:**
```bash
cd "placement-compass-16-main/Lang graph"
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check → `{"status": "ok"}` |
| `POST` | `/v1/agent/generate` | Start a company research pipeline run |
| `GET` | `/v1/agent/status` | List all pipeline runs |
| `GET` | `/v1/agent/status/{run_id}` | Get status of a specific run |
| `GET` | `/docs` | Swagger UI |

---

## Jenkins Setup

### Required Credentials (Manage Jenkins → Credentials → Global)

| Credential ID | Kind | Description |
|---|---|---|
| `ENV` | Secret File | Your backend `.env` file with all API keys |
| `dockerhub-credentials` | Username/Password | Docker Hub login |
| `supabase-url` | Secret Text | `VITE_SUPABASE_URL` |
| `supabase-anon-key` | Secret Text | `VITE_SUPABASE_ANON_KEY` |
| `deploy-ssh-key` | SSH Username with Private Key | Ubuntu server SSH key |

### Pipeline Job Configuration

```
Definition:        Pipeline script from SCM
SCM:               Git
Repository URL:    https://github.com/SheethalGowdaJR/S50.git
Branch Specifier:  */main
Script Path:       placement-compass-16-main/Jenkinsfile
```

### GitHub Webhook

URL: `http://<JENKINS_URL>/github-webhook/`
Content-Type: `application/json`
Events: Push events only

---

## Environment Variables Reference

See [`.env.example`](placement-compass-16-main/.env.example) for the full list.

> **Security:** The `.env` file is in `.gitignore` and is never committed to source control. All secrets are managed via Jenkins Credentials.

---

## Docker Images

| Image | Base | Description |
|---|---|---|
| `placement-compass-frontend` | `nginx:1.27-alpine` | React SPA served by Nginx |
| `placement-compass-backend` | `python:3.12-slim` | FastAPI + LangGraph agent |

Image tagging strategy: `latest` + `BUILD_NUMBER` + `git-sha`

---

## Security

- No secrets in source control (`.env` is git-ignored)
- All credentials via Jenkins Credentials Manager
- Backend runs as non-root user (`appuser`, uid 1001)
- Minimal base images (Alpine/slim)
- Health checks on all containers
- Automatic rollback on failed smoke tests
