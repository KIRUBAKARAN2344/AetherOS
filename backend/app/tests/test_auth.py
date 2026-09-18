from fastapi.testclient import TestClient
from fastapi import APIRouter, Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database.database import Base
from app.database.session import get_db
from app.models.user import User, Role
from app.security import hash_password, get_current_user, RequireRole

from sqlalchemy.pool import StaticPool

# Setup handled by conftest.py

# Dummy endpoint for testing RBAC
@app.get("/dummy-admin", dependencies=[Depends(RequireRole(["ADMIN"]))])
def dummy_admin_route():
    return {"message": "Admin area"}

def test_registration_and_rbac(client, db_session):
    # 1. Register User
    response = client.post(
        "/users/register",
        json={"full_name": "Test User", "email": "test@example.com", "password": "password123"}
    )
    if response.status_code != 200:
        print("Registration Error:", response.json())
    assert response.status_code == 200
    
    # 2. Login User
    response = client.post(
        "/auth/login",
        json={"email": "test@example.com", "password": "password123"}
    )
    assert response.status_code == 200
    token = response.json()["access_token"]
    assert response.json()["role"] == "EMPLOYEE"
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # 3. Test RBAC Failure (EMPLOYEE trying to access ADMIN route)
    response = client.get("/dummy-admin", headers=headers)
    assert response.status_code == 403
    
    # 4. Promote user to ADMIN manually
    user = db_session.query(User).filter(User.email == "test@example.com").first()
    user.role = Role.ADMIN
    db_session.commit()
    
    # 5. Test RBAC Success (ADMIN trying to access ADMIN route)
    response = client.get("/dummy-admin", headers=headers)
    assert response.status_code == 200


