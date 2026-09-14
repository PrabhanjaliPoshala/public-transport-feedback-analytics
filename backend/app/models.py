import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class RouteModel(Base):
    __tablename__ = "routes"

    id = Column(String(50), primary_key=True, index=True)
    route_number = Column(String(20), index=True, nullable=False)
    route_name = Column(String(100), nullable=False)
    origin = Column(String(100), nullable=False)
    destination = Column(String(100), nullable=False)
    status = Column(String(20), default="Good")  # Excellent, Good, Needs Attention, Poor, Critical
    operating_hours = Column(String(50), default="06:00 AM - 10:00 PM")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    trips = relationship("TripModel", back_populates="route", cascade="all, delete-orphan")
    feedback = relationship("FeedbackModel", back_populates="route", cascade="all, delete-orphan")


class TripModel(Base):
    __tablename__ = "trips"

    id = Column(String(50), primary_key=True, index=True)
    route_id = Column(String(50), ForeignKey("routes.id"), nullable=False)
    journey_date = Column(String(20), index=True, nullable=False)
    start_time = Column(String(20), nullable=False)
    end_time = Column(String(20), nullable=False)
    time_period = Column(String(30), index=True, nullable=False)  # 5 PM–7 PM etc.
    status = Column(String(20), default="Completed")  # Completed, Delayed, Cancelled

    # Relationships
    route = relationship("RouteModel", back_populates="trips")
    feedback = relationship("FeedbackModel", back_populates="trip")


class FeedbackModel(Base):
    __tablename__ = "feedback"

    id = Column(String(50), primary_key=True, index=True)
    feedback_id = Column(String(50), unique=True, index=True, nullable=False)  # e.g. FB-10492
    route_id = Column(String(50), ForeignKey("routes.id"), nullable=False)
    trip_id = Column(String(50), ForeignKey("trips.id"), nullable=True)
    
    route_number = Column(String(20), nullable=False)
    route_name = Column(String(100), nullable=False)
    journey_date = Column(String(20), index=True, nullable=False)
    journey_time = Column(String(20), nullable=False)
    time_period = Column(String(30), index=True, nullable=False)
    
    punctuality_rating = Column(Integer, nullable=False)
    cleanliness_rating = Column(Integer, nullable=False)
    crowding_rating = Column(Integer, nullable=False)
    driver_behaviour_rating = Column(Integer, nullable=False)
    overall_rating = Column(Integer, nullable=False)
    
    comment = Column(Text, nullable=False)
    category = Column(String(50), index=True, nullable=False)
    severity = Column(String(20), index=True, nullable=False)  # Low, Medium, High, Critical
    status = Column(String(20), index=True, default="New")  # New, Under Review, Resolved
    ai_confidence = Column(Float, default=0.9)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    route = relationship("RouteModel", back_populates="feedback")
    trip = relationship("TripModel", back_populates="feedback")


class AdminModel(Base):
    __tablename__ = "admins"

    id = Column(String(50), primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(200), nullable=False)
    role = Column(String(20), default="admin")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
