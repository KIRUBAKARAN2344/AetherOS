from fastapi.testclient import TestClient
import pytest
from app.models.user import User, Role
from app.models.department import Department
from app.models.audit import AuditLog
from app.security import hash_password

@pytest.fixture(autouse=True)
def setup_admin(db_session):
    # Seed an ADMIN user
    admin = User(full_name="Admin", email="admin@example.com", password=hash_password("test"), role=Role.ADMIN)
    db_session.add(admin)
    db_session.commit()

def get_admin_token(client):
    response = client.post("/auth/login", json={"email": "admin@example.com", "password": "test"})
    return response.json()["access_token"]

def test_create_department(client):
    token = get_admin_token(client)
    headers = {"Authorization": f"Bearer {token}"}
    
    res = client.post("/departments/", json={"name": "Engineering", "description": "Tech stuff"}, headers=headers)
    assert res.status_code == 200
    assert res.json()["name"] == "Engineering"

def test_get_departments(client):
    token = get_admin_token(client)
    headers = {"Authorization": f"Bearer {token}"}
    
    client.post("/departments/", json={"name": "Engineering", "description": "Tech stuff"}, headers=headers)
    
    res = client.get("/departments/", headers=headers)
    assert res.status_code == 200
    assert len(res.json()) >= 1
    assert res.json()[0]["name"] == "Engineering"

def test_dashboard_stats(client):
    token = get_admin_token(client)
    headers = {"Authorization": f"Bearer {token}"}
    
    client.post("/departments/", json={"name": "Engineering", "description": "Tech stuff"}, headers=headers)
    
    res = client.get("/dashboard/stats", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["employees"] == 1
    assert data["departments"] == 1
    assert len(data["recent_activities"]) == 1
    assert data["recent_activities"][0]["action"] == "CREATE_DEPARTMENT"
