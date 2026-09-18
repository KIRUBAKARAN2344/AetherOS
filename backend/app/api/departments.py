from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.models.department import Department
from app.models.audit import AuditLog
from app.models.user import User
from app.schemas.department import DepartmentCreate, DepartmentResponse
from app.security import get_current_active_user, RequireRole

router = APIRouter(prefix="/departments", tags=["Departments"])

@router.get("/", response_model=List[DepartmentResponse])
def get_departments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return db.query(Department).all()

@router.post("/", response_model=DepartmentResponse)
def create_department(
    department: DepartmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(RequireRole(["ADMIN", "HR"]))
):
    existing = db.query(Department).filter(Department.name == department.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Department already exists")

    new_dept = Department(name=department.name, description=department.description)
    db.add(new_dept)
    db.commit()
    db.refresh(new_dept)

    # Log action
    audit = AuditLog(
        user_id=current_user.id,
        action="CREATE_DEPARTMENT",
        resource="Department",
        details=f"Created department: {new_dept.name}"
    )
    db.add(audit)
    db.commit()

    return new_dept
