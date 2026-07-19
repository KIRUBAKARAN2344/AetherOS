from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.security import verify_password, create_access_token
from pydantic import BaseModel

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email")

    if not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid password")

    token = create_access_token({"sub": user.email})

    return {
        "access_token": token,
        "token_type": "bearer"
    }