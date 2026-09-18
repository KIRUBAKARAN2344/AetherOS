from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, Enum
import enum

from app.database.database import Base

class InvoiceStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    SENT = "SENT"
    PAID = "PAID"
    OVERDUE = "OVERDUE"

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    due_date = Column(Date, nullable=False)
    status = Column(Enum(InvoiceStatus), default=InvoiceStatus.DRAFT)
