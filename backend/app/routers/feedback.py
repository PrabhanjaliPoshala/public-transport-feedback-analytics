import random
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import FeedbackModel, RouteModel
from ..schemas import FeedbackCreate, FeedbackResponse, FeedbackStatusUpdate
from ..services.classifier_service import classifier_service

router = APIRouter(prefix="/feedback", tags=["Feedback"])

@router.get("", response_model=List[FeedbackResponse], summary="List Passenger Feedback Reports")
def get_feedback(
    dateRange: Optional[str] = Query("all"),
    routeId: Optional[str] = Query("all"),
    category: Optional[str] = Query("all"),
    severity: Optional[str] = Query("all"),
    timePeriod: Optional[str] = Query("all"),
    status: Optional[str] = Query("all"),
    searchQuery: Optional[str] = Query(""),
    db: Session = Depends(get_db)
):
    query = db.query(FeedbackModel)

    if routeId and routeId != "all":
        query = query.filter(FeedbackModel.route_id == routeId)
    if category and category != "all":
        query = query.filter(FeedbackModel.category == category)
    if severity and severity != "all":
        query = query.filter(FeedbackModel.severity == severity)
    if timePeriod and timePeriod != "all":
        query = query.filter(FeedbackModel.time_period == timePeriod)
    if status and status != "all":
        query = query.filter(FeedbackModel.status == status)

    records = query.order_by(FeedbackModel.created_at.desc()).all()

    # Filter search query
    if searchQuery and searchQuery.strip():
        q = searchQuery.lower().strip()
        records = [
            r for r in records
            if q in r.feedback_id.lower()
            or q in r.route_number.lower()
            or q in r.comment.lower()
            or q in r.category.lower()
        ]

    return records

@router.post("", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED, summary="Submit Passenger Feedback")
def submit_feedback(feedback_in: FeedbackCreate, db: Session = Depends(get_db)):
    route = db.query(RouteModel).filter(RouteModel.id == feedback_in.route_id).first()
    route_num = route.route_number if route else (feedback_in.route_number or "Route 42")
    route_name = route.route_name if route else (feedback_in.route_name or "Crosstown Express")

    # Run AI Classification
    classification = classifier_service.classify_comment(
        feedback_in.comment,
        {"overall": feedback_in.overall_rating}
    )

    category = feedback_in.category or classification["categories"][0]
    severity = feedback_in.severity or classification["severity"]
    confidence = classification["confidence"]

    feedback_id = f"FB-{random.randint(10000, 99999)}"
    pk_id = f"fb-pk-{datetime.datetime.utcnow().timestamp()}"

    db_feedback = FeedbackModel(
        id=pk_id,
        feedback_id=feedback_id,
        route_id=feedback_in.route_id,
        trip_id=feedback_in.trip_id,
        route_number=route_num,
        route_name=route_name,
        journey_date=feedback_in.journey_date,
        journey_time=feedback_in.journey_time or "18:15",
        time_period=feedback_in.time_period,
        punctuality_rating=feedback_in.punctuality_rating,
        cleanliness_rating=feedback_in.cleanliness_rating,
        crowding_rating=feedback_in.crowding_rating,
        driver_behaviour_rating=feedback_in.driver_behaviour_rating,
        overall_rating=feedback_in.overall_rating,
        comment=feedback_in.comment,
        category=category,
        severity=severity,
        status="New",
        ai_confidence=confidence
    )

    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

@router.get("/{feedback_id}", response_model=FeedbackResponse, summary="Get Feedback Details by ID")
def get_feedback_by_id(feedback_id: str, db: Session = Depends(get_db)):
    record = db.query(FeedbackModel).filter(
        (FeedbackModel.feedback_id == feedback_id) | (FeedbackModel.id == feedback_id)
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Feedback report not found")
    return record

@router.patch("/{feedback_id}/status", response_model=FeedbackResponse, summary="Update Feedback Status")
def update_feedback_status(feedback_id: str, status_in: FeedbackStatusUpdate, db: Session = Depends(get_db)):
    record = db.query(FeedbackModel).filter(
        (FeedbackModel.feedback_id == feedback_id) | (FeedbackModel.id == feedback_id)
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Feedback report not found")
    record.status = status_in.status
    db.commit()
    db.refresh(record)
    return record
