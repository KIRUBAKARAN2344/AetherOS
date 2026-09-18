from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database.session import get_db
from app.models.user import User
from app.security import verify_password, create_access_token

# Create Router
router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# Request Body
class LoginRequest(BaseModel):
    email: str
    password: str


# Login API
@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    print("===================================")
    print("Received Email:", repr(data.email))
    print("Received Password:", repr(data.password))

    # Find user by email
    user = db.query(User).filter(User.email == data.email).first()

    if user is None:
        print("❌ User not found")
        raise HTTPException(
            status_code=401,
            detail="Invalid email"
        )

    print("✅ Database Email:", repr(user.email))

    # Verify password
    if not verify_password(data.password, user.password):
        print("❌ Password mismatch")
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=400,
            detail="Inactive user"
        )

    print("✅ Login Successful")

    # Generate JWT
    token = create_access_token(
        {"sub": user.email}
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role.value,
        "full_name": user.full_name
    }