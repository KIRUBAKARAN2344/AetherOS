from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.session import get_db
from app.models.user import User
from app.models.department import Department
from app.models.audit import AuditLog
from app.security import RequireRole

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats", dependencies=[Depends(RequireRole(["ADMIN", "HR"]))])
def get_dashboard_stats(db: Session = Depends(get_db)):
    employee_count = db.query(func.count(User.id)).scalar()
    department_count = db.query(func.count(Department.id)).scalar()
    
    recent_activities = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(10).all()
    
    return {
        "employees": employee_count,
        "departments": department_count,
        "recent_activities": [
            {
                "id": a.id,
                "action": a.action,
                "resource": a.resource,
                "details": a.details,
                "timestamp": a.timestamp,
                "user_id": a.user_id
            } for a in recent_activities
        ]
    }
