# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.auth import router as auth_router
from app.feedback import router as feedback_router
from app.database import Base, engine

# Initialize the FastAPI app
app = FastAPI()

# Enable CORS for frontend-backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create all database tables on app startup
Base.metadata.create_all(bind=engine)

# Register the routers
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(feedback_router, prefix="/api/feedback", tags=["Feedback"])

# Root endpoint
@app.get("/")
def root():
    return {"message": "Feedback System API Running ✅"}
