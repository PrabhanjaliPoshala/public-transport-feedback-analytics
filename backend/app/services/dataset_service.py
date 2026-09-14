import io
import datetime
import pandas as pd
from typing import Dict, Any, Tuple
from sqlalchemy.orm import Session
from ..models import FeedbackModel, RouteModel
from .classifier_service import classifier_service

class DatasetService:

    def import_csv_dataset(self, db: Session, csv_content: bytes) -> Dict[str, Any]:
        df = pd.read_csv(io.BytesIO(csv_content))

        records_imported = 0
        records_rejected = 0
        detected_routes = set()
        detected_categories = set()
        min_date = "9999-12-31"
        max_date = "0000-01-01"

        id_counter = int(datetime.datetime.utcnow().timestamp())

        for idx, row in df.iterrows():
            # Alias field mappings (MTA 311 / transit feedback formats)
            raw_route = str(row.get("Route") or row.get("Borough/Route") or row.get("Bus Route") or row.get("Line") or "Route 42")
            raw_comment = str(row.get("Comment") or row.get("Descriptor") or row.get("Complaint Description") or row.get("Details") or "")
            raw_category = str(row.get("Category") or row.get("Complaint Type") or row.get("Issue") or "")
            
            raw_rating = row.get("Rating") or row.get("Score")
            try:
                rating_val = float(raw_rating) if pd.notnull(raw_rating) else None
            except ValueError:
                rating_val = None

            raw_date = str(row.get("Created Date") or row.get("Date") or row.get("Journey Date") or datetime.date.today().isoformat())
            
            # Validation
            if not raw_comment and rating_val is None:
                records_rejected += 1
                continue

            date_str = raw_date.split("T")[0]
            if date_str < min_date: min_date = date_str
            if date_str > max_date: max_date = date_str

            route_num = raw_route if raw_route.startswith("Route") else f"Route {raw_route}"
            route_id = f"route-{route_num.lower().replace(' ', '')}"
            detected_routes.add(route_num)

            # Ensure route exists in database
            db_route = db.query(RouteModel).filter(RouteModel.id == route_id).first()
            if not db_route:
                db_route = RouteModel(
                    id=route_id,
                    route_number=route_num,
                    route_name=f"{route_num} (Imported Corridor)",
                    origin="Imported Terminal",
                    destination="City Hub",
                    status="Good"
                )
                db.add(db_route)
                db.commit()

            # AI Classifier fallback for category/severity
            classification = classifier_service.classify_comment(raw_comment, {"overall": rating_val or 3})
            category = raw_category if raw_category and raw_category != "nan" else classification["categories"][0]
            severity = classification["severity"]

            detected_categories.add(category)

            overall_rating = int(round(rating_val)) if rating_val is not None else (1 if severity == "Critical" else 3)
            overall_rating = max(1, min(5, overall_rating))

            id_counter += 1
            feedback_entry = FeedbackModel(
                id=f"CSV-{id_counter}",
                feedback_id=f"FB-CSV-{id_counter % 100000}",
                route_id=route_id,
                route_number=route_num,
                route_name=f"{route_num} (Imported Corridor)",
                journey_date=date_str,
                journey_time="14:00",
                time_period="12 PM–3 PM",
                punctuality_rating=overall_rating,
                cleanliness_rating=overall_rating,
                crowding_rating=overall_rating,
                driver_behaviour_rating=overall_rating,
                overall_rating=overall_rating,
                comment=raw_comment or "Imported report",
                category=category,
                severity=severity,
                status="New",
                ai_confidence=classification["confidence"]
            )
            db.add(feedback_entry)
            records_imported += 1

        db.commit()

        return {
            "recordsImported": records_imported,
            "recordsRejected": records_rejected,
            "routesDetected": len(detected_routes),
            "dateRange": {
                "start": min_date if min_date != "9999-12-31" else "2026-09-01",
                "end": max_date if max_date != "0000-01-01" else "2026-09-14"
            },
            "categoriesDetected": list(detected_categories)
        }

dataset_service = DatasetService()
