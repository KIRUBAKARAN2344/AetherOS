from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum
from datetime import date

from app.database.database import Base

class ExpenseStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    description = Column(String)
    date = Column(Date, default=date.today)
    owner_id = Column(Integer, ForeignKey("users.id"))
    status = Column(Enum(ExpenseStatus), default=ExpenseStatus.PENDING)

    owner = relationship("User")
