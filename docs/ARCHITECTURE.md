# AetherOS Architecture

## High-Level Architecture
AetherOS is designed as a modern, agentic enterprise operating system.

**USER → REACT FRONTEND → FASTAPI BACKEND → AI ORCHESTRATOR / ENTERPRISE SERVICES → POSTGRESQL DB**

### 1. Frontend
- **Framework**: React 19 + Vite
- **Styling**: TailwindCSS
- **State/Routing**: React Router, Context API (Planned for Auth)
- **Communication**: Axios

### 2. Backend
- **Framework**: FastAPI (Python)
- **ORM**: SQLAlchemy 2.x
- **Migrations**: Alembic
- **Validation**: Pydantic
- **Auth**: JWT-based Authentication + RBAC
- **Structure**:
  - `/app/api`: FastAPI Routers
  - `/app/core`: Configuration, Security, Dependencies
  - `/app/database`: DB Sessions
  - `/app/models`: SQLAlchemy Models
  - `/app/schemas`: Pydantic Schemas
  - `/app/agents`: AI Agent logic (HR, Finance)
  - `/app/services`: Core Business Logic

### 3. Database
- **Engine**: PostgreSQL
- **Vector Search**: pgvector (Planned for RAG Phase)
- **Entities (Planned)**:
  - Core: User, Role, AuditLog
  - HR: Department, Employee, Attendance, LeaveRequest
  - Finance: Expense, Invoice, Budget
  - RAG: Document, DocumentChunk

### 4. AI Architecture (Planned)
- **Orchestrator**: Intercepts user queries and routes them to specialized agents.
- **Agents**: HR Agent, Finance Agent.
- **Tools**: Strictly authorized backend functions mapped to standard Python execution. Agents do NOT execute arbitrary SQL.

### 5. Deployment (Planned)
- Docker + Docker Compose configuration encompassing Frontend, Backend, and PostgreSQL services.
