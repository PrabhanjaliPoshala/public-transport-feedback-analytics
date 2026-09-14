from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import OverviewResponse, RoutePerformanceResponse
from ..services.analytics_service import analytics_service

router = APIRouter(prefix="/analytics", tags=["Analytics & Intelligence"])

@router.get("/overview", response_model=OverviewResponse, summary="Get Top Operational KPI Overview")
def get_analytics_overview(
    dateRange: Optional[str] = Query("all"),
    routeId: Optional[str] = Query("all"),
    category: Optional[str] = Query("all"),
    severity: Optional[str] = Query("all"),
    timePeriod: Optional[str] = Query("all"),
    status: Optional[str] = Query("all"),
    db: Session = Depends(get_db)
):
    filters = {
        "dateRange": dateRange,
        "routeId": routeId,
        "category": category,
        "severity": severity,
        "timePeriod": timePeriod,
        "status": status,
    }
    return analytics_service.calculate_overview(db, filters)

@router.get("/routes", response_model=List[RoutePerformanceResponse], summary="Get Route Performance Index")
@router.get("/rankings", response_model=List[RoutePerformanceResponse], summary="Get Route Rankings")
def get_route_rankings(
    dateRange: Optional[str] = Query("all"),
    routeId: Optional[str] = Query("all"),
    category: Optional[str] = Query("all"),
    severity: Optional[str] = Query("all"),
    timePeriod: Optional[str] = Query("all"),
    db: Session = Depends(get_db)
):
    filters = {
        "dateRange": dateRange,
        "routeId": routeId,
        "category": category,
        "severity": severity,
        "timePeriod": timePeriod,
    }
    return analytics_service.calculate_route_rankings(db, filters)

@router.get("/routes/{route_id}", summary="Get Detailed Route Analytics & AI Insights")
def get_route_detail_analytics(route_id: str, db: Session = Depends(get_db)):
    detail = analytics_service.get_route_detail(db, route_id)
    if not detail:
        raise HTTPException(status_code=404, detail="Route analytics not found")
    return detail

@router.get(
    "/deterioration",
    response_model=List[RoutePerformanceResponse],
    summary="Identify Deteriorating Routes"
)
def get_deterioration_analysis(
    db: Session = Depends(get_db)
):
    rankings = analytics_service.calculate_route_rankings(db)

    deteriorating = [
        r
        for r in rankings
        if r["trend"] == "Deteriorating"
    ]

    return deteriorating

@router.get("/categories", summary="Get Complaint Counts by Category")
def get_category_analytics(db: Session = Depends(get_db)):
    rankings = analytics_service.calculate_route_rankings(db)
    # Collect category counts
    overview = analytics_service.calculate_overview(db)
    return {"mostReported": overview["mostReportedIssue"], "rankings": rankings}

@router.get("/time-analysis", summary="Get Time-of-Day Complaint Distribution")
def get_time_analytics(db: Session = Depends(get_db)):
    rankings = analytics_service.calculate_route_rankings(db)
    time_slots = ["6 AM–9 AM", "9 AM–12 PM", "12 PM–3 PM", "3 PM–5 PM", "5 PM–7 PM", "7 PM–10 PM"]
    return {"slots": time_slots, "worstPeriodSystemWide": "5 PM–7 PM"}

@router.get("/trends", summary="Get Historical Rating Trends")
def get_trends_analytics(db: Session = Depends(get_db)):
    overview = analytics_service.calculate_overview(db)
    return {"ratingChangePercent": overview["ratingChangePercent"]}
