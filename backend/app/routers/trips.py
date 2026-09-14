import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import TripModel
from ..schemas import TripCreate, TripResponse

router = APIRouter(prefix="/trips", tags=["Trips"])

@router.get("", response_model=List[TripResponse], summary="List All Transit Trips")
def get_trips(db: Session = Depends(get_db)):
    return db.query(TripModel).all()

@router.post("", response_model=TripResponse, status_code=status.HTTP_201_CREATED, summary="Schedule New Trip")
def create_trip(trip_in: TripCreate, db: Session = Depends(get_db)):
    trip_id = f"trip-{uuid.uuid4().hex[:8]}"
    db_trip = TripModel(id=trip_id, **trip_in.dict())
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)
    return db_trip

@router.get("/{trip_id}", response_model=TripResponse, summary="Get Trip by ID")
def get_trip(trip_id: str, db: Session = Depends(get_db)):
    trip = db.query(TripModel).filter(TripModel.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip
