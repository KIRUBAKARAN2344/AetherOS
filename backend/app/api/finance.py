from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.models.expense import Expense, ExpenseStatus
from app.models.invoice import Invoice, InvoiceStatus
from app.models.budget import Budget
from app.models.user import User
from app.schemas.finance import (
    ExpenseCreate, ExpenseResponse, ExpenseUpdateStatus,
    InvoiceCreate, InvoiceResponse, InvoiceUpdateStatus,
    BudgetCreate, BudgetResponse
)
from app.security import get_current_active_user, RequireRole

router = APIRouter(prefix="/finance", tags=["Finance"])

# --- Expenses ---
@router.post("/expenses/", response_model=ExpenseResponse)
def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    db_expense = Expense(**expense.model_dump(), owner_id=current_user.id)
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@router.get("/expenses/", response_model=List[ExpenseResponse])
def get_expenses(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    # Admin and HR can see all expenses, Employees can only see their own
    if current_user.role in ["ADMIN", "HR"]:
        return db.query(Expense).all()
    return db.query(Expense).filter(Expense.owner_id == current_user.id).all()

@router.patch("/expenses/{expense_id}/status", response_model=ExpenseResponse, dependencies=[Depends(RequireRole(["ADMIN", "HR"]))])
def update_expense_status(expense_id: int, status_update: ExpenseUpdateStatus, db: Session = Depends(get_db)):
    db_expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    db_expense.status = status_update.status
    db.commit()
    db.refresh(db_expense)
    return db_expense

# --- Invoices ---
@router.post("/invoices/", response_model=InvoiceResponse, dependencies=[Depends(RequireRole(["ADMIN", "HR"]))])
def create_invoice(invoice: InvoiceCreate, db: Session = Depends(get_db)):
    db_invoice = Invoice(**invoice.model_dump())
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    return db_invoice

@router.get("/invoices/", response_model=List[InvoiceResponse])
def get_invoices(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    # Any active user might need to see invoices (or restrict to ADMIN/HR, following general rule)
    if current_user.role not in ["ADMIN", "HR"]:
        raise HTTPException(status_code=403, detail="Not authorized to view invoices")
    return db.query(Invoice).all()

@router.patch("/invoices/{invoice_id}/status", response_model=InvoiceResponse, dependencies=[Depends(RequireRole(["ADMIN", "HR"]))])
def update_invoice_status(invoice_id: int, status_update: InvoiceUpdateStatus, db: Session = Depends(get_db)):
    db_invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not db_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    db_invoice.status = status_update.status
    db.commit()
    db.refresh(db_invoice)
    return db_invoice

# --- Budgets ---
@router.post("/budgets/", response_model=BudgetResponse, dependencies=[Depends(RequireRole(["ADMIN"]))])
def create_budget(budget: BudgetCreate, db: Session = Depends(get_db)):
    db_budget = Budget(**budget.model_dump())
    db.add(db_budget)
    db.commit()
    db.refresh(db_budget)
    return db_budget

@router.get("/budgets/", response_model=List[BudgetResponse], dependencies=[Depends(RequireRole(["ADMIN", "HR"]))])
def get_budgets(db: Session = Depends(get_db)):
    return db.query(Budget).all()
