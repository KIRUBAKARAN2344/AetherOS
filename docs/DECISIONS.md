# Architectural Decisions Log

This document records the major architectural decisions made during the development of AetherOS.

## Phase 0: Initial Audit & Architecture Lock
**Date:** September 2026

1. **Retain Existing Tech Stack**: The current stack (React + Vite, FastAPI, PostgreSQL, SQLAlchemy) is sound and matches the requirements. We will build upon it rather than rewriting it.
2. **Environment Configuration**: We will immediately remove hardcoded secrets (like `aetheros_secret_key` and DB URLs) and adopt `python-dotenv` for 12-factor app compliance.
3. **Database Migrations**: `Base.metadata.create_all` will be deprecated in favor of **Alembic**. This is crucial for production readiness and safe schema evolution.
4. **Authentication Storage**: Currently using `localStorage` on the frontend. We will retain this temporarily for Phase 1/2, but it will require evaluation for XSS vulnerabilities. If feasible later, we may move to HttpOnly cookies, though Bearer tokens in localStorage is a standard SPA pattern if CSRF is mitigated and XSS is prevented.
5. **Bloated Requirements**: The `requirements.txt` file has dozens of unused packages (e.g., Keras, Jupyter). We will leave them for now to obey the "do not break working code" rule, but we will document the need to prune them in Phase 8 (Deployment Readiness).
