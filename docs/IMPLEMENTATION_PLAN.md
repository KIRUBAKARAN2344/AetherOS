# Implementation Plan: Phase 4 (Finance Module)

Based on the master prompt, we are now implementing the Finance Module.

## Proposed Changes

### Database Models
- `app/models/expense.py`: Create `Expense` model (amount, category, description, date, owner, status).
- `app/models/invoice.py`: Create `Invoice` model (status, due_date, amount).
- `app/models/budget.py`: Create `Budget` model (period, department, allocated_amount).

### Schemas
- `app/schemas/finance.py`: Create Pydantic models for validation of finance entities.

### API Endpoints
- `app/api/finance.py`: Create FastAPI routers for Expenses, Invoices, and Budgets, protected by RBAC (ADMIN, HR, EMPLOYEE where applicable).

### Migrations
- Generate Alembic migration script for the new tables.
