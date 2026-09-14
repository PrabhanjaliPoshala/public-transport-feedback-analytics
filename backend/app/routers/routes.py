import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import RouteModel
from ..schemas import RouteCreate, RouteResponse

router = APIRouter(prefix="/routes", tags=["Routes"])

@router.get("", response_model=List[RouteResponse], summary="List All Transit Routes")
def get_routes(db: Session = Depends(get_db)):
    return db.query(RouteModel).all()

@router.post("", response_model=RouteResponse, status_code=status.HTTP_201_CREATED, summary="Create New Transit Route")
def create_route(route_in: RouteCreate, db: Session = Depends(get_db)):
    route_id = f"route-{uuid.uuid4().hex[:8]}"
    db_route = RouteModel(id=route_id, **route_in.dict())
    db.add(db_route)
    db.commit()
    db.refresh(db_route)
    return db_route

@router.get("/{route_id}", response_model=RouteResponse, summary="Get Route Details by ID")
def get_route_by_id(route_id: str, db: Session = Depends(get_db)):
    route = db.query(RouteModel).filter(RouteModel.id == route_id).first()
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")
    return route

@router.put("/{route_id}", response_model=RouteResponse, summary="Update Route Info")
def update_route(route_id: str, route_in: RouteCreate, db: Session = Depends(get_db)):
    route = db.query(RouteModel).filter(RouteModel.id == route_id).first()
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")
    for key, value in route_in.dict().items():
        setattr(route, key, value)
    db.commit()
    db.refresh(route)
    return route

@router.delete("/{route_id}", summary="Delete Route")
def delete_route(route_id: str, db: Session = Depends(get_db)):
    route = db.query(RouteModel).filter(RouteModel.id == route_id).first()
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")
    db.delete(route)
    db.commit()
    return {"message": f"Route {route_id} deleted successfully"}
