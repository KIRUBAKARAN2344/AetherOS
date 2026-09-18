from pydantic import BaseModel, ConfigDict
from typing import Optional, List
import datetime
from app.models.expense import ExpenseStatus
from app.models.invoice import InvoiceStatus

# --- Expense Schemas ---
class ExpenseBase(BaseModel):
    amount: float
    category: str
    description: Optional[str] = None
    date: Optional[datetime.date] = None

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseResponse(ExpenseBase):
    id: int
    owner_id: int
    status: ExpenseStatus

    model_config = ConfigDict(from_attributes=True)

class ExpenseUpdateStatus(BaseModel):
    status: ExpenseStatus

# --- Invoice Schemas ---
class InvoiceBase(BaseModel):
    title: str
    amount: float
    due_date: datetime.date

class InvoiceCreate(InvoiceBase):
    pass

class InvoiceResponse(InvoiceBase):
    id: int
    status: InvoiceStatus

    model_config = ConfigDict(from_attributes=True)

class InvoiceUpdateStatus(BaseModel):
    status: InvoiceStatus

# --- Budget Schemas ---
class BudgetBase(BaseModel):
    period: str
    department_id: int
    allocated_amount: float

class BudgetCreate(BudgetBase):
    pass

class BudgetResponse(BudgetBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
