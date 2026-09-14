import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

# -------------------------------------------------------------
# AUTH & USER SCHEMAS
# -------------------------------------------------------------
class LoginRequest(BaseModel):
    email: str = Field(..., example="admin@citytransit.gov")
    password: str = Field(..., example="admin123")

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    email: str
    role: str

# -------------------------------------------------------------
# ROUTE SCHEMAS
# -------------------------------------------------------------
class RouteBase(BaseModel):
    route_number: str = Field(..., example="Route 42")
    route_name: str = Field(..., example="Crosstown Express")
    origin: str = Field(..., example="Downtown Terminal")
    destination: str = Field(..., example="State University")
    status: str = Field("Good", example="Good")
    operating_hours: Optional[str] = "06:00 AM - 10:00 PM"

class RouteCreate(RouteBase):
    pass

class RouteResponse(RouteBase):
    id: str
    created_at: Optional[datetime.datetime] = None

    class Config:
        from_attributes = True

# -------------------------------------------------------------
# TRIP SCHEMAS
# -------------------------------------------------------------
class TripBase(BaseModel):
    route_id: str
    journey_date: str = Field(..., example="2026-09-14")
    start_time: str = Field(..., example="17:15")
    end_time: str = Field(..., example="18:30")
    time_period: str = Field(..., example="5 PM–7 PM")
    status: str = Field("Completed", example="Completed")

class TripCreate(TripBase):
    pass

class TripResponse(TripBase):
    id: str

    class Config:
        from_attributes = True

# -------------------------------------------------------------
# FEEDBACK SCHEMAS
# -------------------------------------------------------------
class FeedbackCreate(BaseModel):
    route_id: str = Field(..., example="route-42")
    route_number: Optional[str] = "Route 42"
    route_name: Optional[str] = "Crosstown Express"
    trip_id: Optional[str] = None
    journey_date: str = Field(..., example="2026-09-14")
    journey_time: Optional[str] = "18:15"
    time_period: str = Field(..., example="5 PM–7 PM")
    punctuality_rating: int = Field(..., ge=1, le=5, example=2)
    cleanliness_rating: int = Field(..., ge=1, le=5, example=3)
    crowding_rating: int = Field(..., ge=1, le=5, example=1)
    driver_behaviour_rating: int = Field(..., ge=1, le=5, example=3)
    overall_rating: int = Field(..., ge=1, le=5, example=2)
    comment: str = Field(..., example="The bus is always packed after 6 PM and often arrives late.")
    category: Optional[str] = Field("Crowding", example="Crowding")
    severity: Optional[str] = Field("High", example="High")

class FeedbackStatusUpdate(BaseModel):
    status: str = Field(..., example="Under Review")  # New, Under Review, Resolved

class FeedbackResponse(BaseModel):
    id: str
    feedback_id: str
    route_id: str
    route_number: str
    route_name: str
    journey_date: str
    journey_time: str
    time_period: str
    punctuality_rating: int
    cleanliness_rating: int
    crowding_rating: int
    driver_behaviour_rating: int
    overall_rating: int
    comment: str
    category: str
    severity: str
    status: str
    ai_confidence: float
    created_at: Optional[datetime.datetime] = None

    class Config:
        from_attributes = True

# -------------------------------------------------------------
# AI CLASSIFICATION SCHEMAS
# -------------------------------------------------------------
class ClassifyRequest(BaseModel):
    comment: str = Field(..., example="The bus is always packed after 6 PM and often arrives late.")
    ratings: Optional[dict] = None

class ClassifyResponse(BaseModel):
    categories: List[str]
    severity: str
    confidence: float
    explanation: Optional[str] = None

# -------------------------------------------------------------
# ANALYTICS SCHEMAS
# -------------------------------------------------------------
class OverviewResponse(BaseModel):
    totalFeedback: int
    averageRating: float
    ratingChangePercent: float
    totalComplaints: int
    complaintsChangePercent: float
    highCriticalComplaints: int
    worstPerformingRoute: dict
    mostReportedIssue: dict

class RoutePerformanceResponse(BaseModel):
    rank: int
    route_id: str
    route_number: str
    route_name: str
    average_rating: float
    previous_period_rating: float
    rating_change: float
    punctuality: float
    cleanliness: float
    crowding: float
    driver_behaviour: float
    total_feedback: int
    complaints_count: int
    high_severity_count: int
    trend: str
    status: str
    top_issue: str
    second_issue: str
    worst_period: str

class OperationalInsightResponse(BaseModel):
    id: str
    type: str
    title: str
    description: str
    route_id: Optional[str] = None
    route_number: Optional[str] = None
    metric: str
    severity: str
    created_at: str
