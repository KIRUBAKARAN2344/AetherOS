import pytest
from app.models.user import User, Role
from app.models.department import Department
from app.security import hash_password

@pytest.fixture(autouse=True)
def setup_users(db_session):
    admin = User(full_name="Admin", email="admin_fin@example.com", password=hash_password("test"), role=Role.ADMIN)
    emp = User(full_name="Emp", email="emp_fin@example.com", password=hash_password("test"), role=Role.EMPLOYEE)
    dept = Department(name="Finance", description="Finance dept")
    db_session.add_all([admin, emp, dept])
    db_session.commit()

def get_token(client, email):
    response = client.post("/auth/login", json={"email": email, "password": "test"})
    return response.json()["access_token"]

def test_create_expense(client):
    token = get_token(client, "emp_fin@example.com")
    headers = {"Authorization": f"Bearer {token}"}
    
    res = client.post("/finance/expenses/", json={
        "amount": 100.5,
        "category": "Travel",
        "description": "Flight ticket",
        "date": "2026-09-10"
    }, headers=headers)
    
    if res.status_code != 200:
        print("Expense Create Error:", res.json())
    assert res.status_code == 200
    assert res.json()["amount"] == 100.5
    assert res.json()["status"] == "PENDING"

def test_get_expenses(client):
    # Setup expense
    test_create_expense(client)
    
    # Emp should see it
    token = get_token(client, "emp_fin@example.com")
    headers = {"Authorization": f"Bearer {token}"}
    res = client.get("/finance/expenses/", headers=headers)
    assert res.status_code == 200
    assert len(res.json()) == 1
    
    # Admin should see it
    token_admin = get_token(client, "admin_fin@example.com")
    headers_admin = {"Authorization": f"Bearer {token_admin}"}
    res_admin = client.get("/finance/expenses/", headers=headers_admin)
    assert res_admin.status_code == 200
    assert len(res_admin.json()) == 1

def test_update_expense_status_rbac(client):
    # Setup expense
    test_create_expense(client)
    
    token = get_token(client, "emp_fin@example.com")
    headers = {"Authorization": f"Bearer {token}"}
    
    # Emp trying to update status should fail
    res = client.patch("/finance/expenses/1/status", json={"status": "APPROVED"}, headers=headers)
    assert res.status_code == 403
    
    # Admin trying to update status should pass
    token_admin = get_token(client, "admin_fin@example.com")
    headers_admin = {"Authorization": f"Bearer {token_admin}"}
    res_admin = client.patch("/finance/expenses/1/status", json={"status": "APPROVED"}, headers=headers_admin)
    assert res_admin.status_code == 200
    assert res_admin.json()["status"] == "APPROVED"

def test_budget_creation(client):
    token = get_token(client, "admin_fin@example.com")
    headers = {"Authorization": f"Bearer {token}"}
    
    res = client.post("/finance/budgets/", json={
        "period": "Q3 2026",
        "department_id": 1,
        "allocated_amount": 5000.0
    }, headers=headers)
    
    assert res.status_code == 200
    assert res.json()["allocated_amount"] == 5000.0

def test_employee_cannot_create_budget(client):
    token = get_token(client, "emp_fin@example.com")
    headers = {"Authorization": f"Bearer {token}"}
    
    res = client.post("/finance/budgets/", json={
        "period": "Q3 2026",
        "department_id": 1,
        "allocated_amount": 5000.0
    }, headers=headers)
    
    assert res.status_code == 403
