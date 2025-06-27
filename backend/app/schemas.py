from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class FeedbackUpdateAck(BaseModel):
    feedback_id: int
    acknowledged: bool



# ✅ Signup input schema
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str
    department: str
    role: str


# ✅ Login input schema
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# ✅ Output schema for user (without password)
class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: str
    department: str
    role: str

    class Config:
        orm_mode = True


# ✅ JWT Token response schema (used in /login)
class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict  # Can also be UserOut if you prefer strict typing


# ✅ Feedback create input schema
class FeedbackCreate(BaseModel):
    employee_id: int
    strengths: str
    improvements: str
    sentiment: str


# ✅ Feedback output schema
class FeedbackOut(BaseModel):
    id: int
    employee_id: int
    manager_id: int
    strengths: str
    improvements: str
    sentiment: str
    created_at: datetime

    class Config:
        orm_mode = True
