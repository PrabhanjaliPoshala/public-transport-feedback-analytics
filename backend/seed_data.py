import datetime
import random
from sqlalchemy.orm import Session
from app.database import engine, SessionLocal, Base
from app.models import AdminModel, RouteModel, TripModel, FeedbackModel
from app.dependencies import get_password_hash

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # 1. Seed Admin Account
        admin = db.query(AdminModel).filter(AdminModel.email == "admin@citytransit.gov").first()
        if not admin:
            admin = AdminModel(
                id="admin-001",
                email="admin@citytransit.gov",
                password_hash=get_password_hash("admin123"),
                role="admin"
            )
            db.add(admin)
            print("✔ Admin user seeded: admin@citytransit.gov / admin123")

        # 2. Seed 10 Routes
        routes_data = [
            {"id": "route-42", "number": "Route 42", "name": "Crosstown Express (Downtown - University)", "origin": "Downtown Terminal", "destination": "State University", "status": "Critical"},
            {"id": "route-17", "number": "Route 17", "name": "Harbor Metro Line", "origin": "East Port Harbor", "destination": "Central Transit Hub", "status": "Poor"},
            {"id": "route-4", "number": "Route 4", "name": "Westside Commuter Loop", "origin": "West End Mall", "destination": "Financial District", "status": "Needs Attention"},
            {"id": "route-10", "number": "Route 10", "name": "Airport Direct Shuttle", "origin": "International Airport", "destination": "Grand Hotel Terminal", "status": "Excellent"},
            {"id": "route-88", "number": "Route 88", "name": "Northern Heights Feeder", "origin": "North Ridge Park", "destination": "Subway Station", "status": "Good"},
            {"id": "route-12", "number": "Route 12", "name": "South Bay Corridor", "origin": "South Bay Marina", "destination": "Civic Center", "status": "Good"},
            {"id": "route-25", "number": "Route 25", "name": "Tech Park Rapid Transit", "origin": "Innovation District", "destination": "Central Station", "status": "Excellent"},
            {"id": "route-31", "number": "Route 31", "name": "Eastside Orbital", "origin": "Eastside Plaza", "destination": "Medical Center", "status": "Needs Attention"},
            {"id": "route-55", "number": "Route 55", "name": "Industrial Park Shuttle", "origin": "Logistics Hub", "destination": "Metro Gate", "status": "Good"},
            {"id": "route-9", "number": "Route 9", "name": "Riverfront Circular", "origin": "Pier 9", "destination": "Riverfront Market", "status": "Excellent"},
        ]

        for r in routes_data:
            existing = db.query(RouteModel).filter(RouteModel.id == r["id"]).first()
            if not existing:
                db.add(RouteModel(
                    id=r["id"],
                    route_number=r["number"],
                    route_name=r["name"],
                    origin=r["origin"],
                    destination=r["destination"],
                    status=r["status"]
                ))
        print("✔ 10 Routes seeded.")

        # 3. Seed Trips
        time_periods = ["6 AM–9 AM", "9 AM–12 PM", "12 PM–3 PM", "3 PM–5 PM", "5 PM–7 PM", "7 PM–10 PM"]
        trip_counter = 100
        for r in routes_data:
            for day in range(60):
                d_str = (datetime.date(2026, 9, 14) - datetime.timedelta(days=day)).isoformat()
                trip_counter += 1
                db.add(TripModel(
                    id=f"trip-{r['id']}-{trip_counter}",
                    route_id=r["id"],
                    journey_date=d_str,
                    start_time="17:15",
                    end_time="18:30",
                    time_period="5 PM–7 PM",
                    status="Delayed" if r["id"] in ["route-42", "route-17"] else "Completed"
                ))
        print("✔ 60+ Trips seeded.")

        # 4. Seed Feedback Records (220+ records)
        fb_existing = db.query(FeedbackModel).count()
        if fb_existing < 100:
            id_counter = 1000
            now = datetime.date(2026, 9, 14)

            # Route 42 Generation (130 records, severe deterioration)
            for i in range(130):
                days_ago = random.randint(0, 59)
                is_recent = days_ago <= 30
                is_peak = random.random() < 0.70
                period = "5 PM–7 PM" if is_peak else random.choice(time_periods)

                punctuality = 1 if is_recent and period == "5 PM–7 PM" else 2
                cleanliness = 2 if is_recent else 3
                crowding = 1 if period == "5 PM–7 PM" else 2
                driver = 3

                overall = max(1, min(5, round((punctuality + cleanliness + crowding + driver) / 4)))

                if period == "5 PM–7 PM" or crowding == 1:
                    category = "Crowding"
                    comment = "The bus is always packed after 6 PM and often arrives late."
                    severity = "Critical" if is_recent else "High"
                elif punctuality <= 2:
                    category = "Punctuality / Delay"
                    comment = "Bus arrived 25 minutes late at Downtown Terminal."
                    severity = "High"
                else:
                    category = "Driver Behaviour"
                    comment = "Driver bypassed passenger waiting at university stop."
                    severity = "Medium"

                id_counter += 1
                d_str = (now - datetime.timedelta(days=days_ago)).isoformat()
                db.add(FeedbackModel(
                    id=f"fb-seed-{id_counter}",
                    feedback_id=f"FB-{id_counter}",
                    route_id="route-42",
                    route_number="Route 42",
                    route_name="Crosstown Express (Downtown - University)",
                    journey_date=d_str,
                    journey_time="18:15" if period == "5 PM–7 PM" else "08:30",
                    time_period=period,
                    punctuality_rating=punctuality,
                    cleanliness_rating=cleanliness,
                    crowding_rating=crowding,
                    driver_behaviour_rating=driver,
                    overall_rating=overall,
                    comment=comment,
                    category=category,
                    severity=severity,
                    status="Resolved" if i % 4 == 0 else "New",
                    ai_confidence=0.94
                ))

            # Other Routes Generation (110 records)
            for i in range(110):
                r_info = routes_data[1 + (i % (len(routes_data) - 1))]
                days_ago = random.randint(0, 59)
                period = random.choice(time_periods)
                overall = 4 if r_info["id"] in ["route-10", "route-25"] else (2 if r_info["id"] == "route-17" else 3)
                
                category = "Punctuality / Delay" if overall <= 3 else "Cleanliness"
                comment = "Minor delay along corridor" if overall <= 3 else "Comfortable ride on schedule."
                severity = "Medium" if overall <= 3 else "Low"

                id_counter += 1
                d_str = (now - datetime.timedelta(days=days_ago)).isoformat()
                db.add(FeedbackModel(
                    id=f"fb-seed-{id_counter}",
                    feedback_id=f"FB-{id_counter}",
                    route_id=r_info["id"],
                    route_number=r_info["number"],
                    route_name=r_info["name"],
                    journey_date=d_str,
                    journey_time="12:30",
                    time_period=period,
                    punctuality_rating=overall,
                    cleanliness_rating=overall,
                    crowding_rating=overall,
                    driver_behaviour_rating=overall,
                    overall_rating=overall,
                    comment=comment,
                    category=category,
                    severity=severity,
                    status="New",
                    ai_confidence=0.89
                ))

            print("✔ 240+ Feedback records seeded (Route 42 deterioration configured).")

        db.commit()
        print("🎉 Database seeding completed successfully!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
