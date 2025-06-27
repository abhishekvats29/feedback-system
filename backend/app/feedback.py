# app/feedback.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas, database
from app.auth import get_current_user  # ✅ Import it directly

router = APIRouter()


# -------------------------------
# 📨 Submit Feedback (Manager)
# -------------------------------
@router.post("/", response_model=schemas.FeedbackOut)
def submit_feedback(
    feedback: schemas.FeedbackCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "manager":
        raise HTTPException(status_code=403, detail="Only managers can submit feedback")

    new_feedback = models.Feedback(
        employee_id=feedback.employee_id,
        manager_id=current_user.id,
        strengths=feedback.strengths,
        improvements=feedback.improvements,
        sentiment=feedback.sentiment,
    )
    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)
    return new_feedback


# -------------------------------------
# 📥 Get Feedback Received (Employee)
# -------------------------------------
@router.get("/employee", response_model=List[schemas.FeedbackOut])
def get_employee_feedback(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "employee":
        raise HTTPException(status_code=403, detail="Only employees can view this")

    return db.query(models.Feedback).filter(models.Feedback.employee_id == current_user.id).all()


# -----------------------------------
# 📊 Get Feedback Given (Manager)
# -----------------------------------
@router.get("/manager", response_model=List[schemas.FeedbackOut])
def get_manager_feedback(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "manager":
        raise HTTPException(status_code=403, detail="Only managers can view this")

    return db.query(models.Feedback).filter(models.Feedback.manager_id == current_user.id).all()


# -----------------------------------------
# ✅ Acknowledge Feedback (Employee)
# -----------------------------------------
@router.put("/acknowledge")
def acknowledge_feedback(
    data: schemas.FeedbackUpdateAck,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "employee":
        raise HTTPException(status_code=403, detail="Only employees can acknowledge")

    feedback = db.query(models.Feedback).filter(
        models.Feedback.id == data.feedback_id,
        models.Feedback.employee_id == current_user.id
    ).first()

    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")

    feedback.acknowledged = data.acknowledged
    db.commit()
    return {"detail": "Acknowledged successfully"}
