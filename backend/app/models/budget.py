from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.database.database import Base

class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    period = Column(String, nullable=False) # e.g., "Q1 2026", "2026-09"
    department_id = Column(Integer, ForeignKey("departments.id"))
    allocated_amount = Column(Float, nullable=False)

    department = relationship("Department")
