from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate
from app.security import hash_password
router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    new_user = User(
        full_name=user.full_name,
        email=user.email,
       password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "user_id": new_user.id
    }