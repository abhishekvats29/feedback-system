# app/models.py
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    phone = Column(String)
    department = Column(String)
    role = Column(String)  # "employee" or "manager"

    feedbacks_received = relationship("Feedback", back_populates="employee", foreign_keys='Feedback.employee_id')
    feedbacks_given = relationship("Feedback", back_populates="manager", foreign_keys='Feedback.manager_id')

class Feedback(Base):
    __tablename__ = "feedbacks"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("users.id"))
    manager_id = Column(Integer, ForeignKey("users.id"))
    strengths = Column(String)
    improvements = Column(String)
    sentiment = Column(String)
    acknowledged = Column(Boolean, default=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    employee = relationship("User", foreign_keys=[employee_id], back_populates="feedbacks_received")
    manager = relationship("User", foreign_keys=[manager_id], back_populates="feedbacks_given")
