from sqlalchemy import Column, Integer, String, Boolean, Enum
from app.database.database import Base
import enum

class Role(str, enum.Enum):
    ADMIN = "ADMIN"
    HR = "HR"
    EMPLOYEE = "EMPLOYEE"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(Enum(Role), default=Role.EMPLOYEE, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)