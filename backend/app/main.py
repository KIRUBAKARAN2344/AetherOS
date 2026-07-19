from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base, engine
from app.models.user import User

from app.api.users import router as user_router
from app.api.auth import router as auth_router

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

# Create database tables
Base.metadata.create_all(bind=engine)

# Register routers
app.include_router(user_router)
app.include_router(auth_router)

# Home route
@app.get("/")
def home():
    return {
        "message": "Welcome to AetherOS 🚀",
        "database": "Connected Successfully"
    }