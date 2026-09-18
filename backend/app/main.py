from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base, engine
from app.core.config import settings
from app.api import auth, users, departments, dashboard, finance

# Create FastAPI application FIRST
app = FastAPI(
    title="AetherOS API",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database tables are now managed by Alembic
# Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(departments.router)
app.include_router(dashboard.router)
app.include_router(finance.router)

# Home route
@app.get("/")
def home():
    return {
        "message": "Welcome to AetherOS 🚀",
        "database": "Connected Successfully"
    }

@app.get("/health")
def health():
    return {"status": "healthy"}