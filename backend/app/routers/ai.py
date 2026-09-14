from fastapi import APIRouter
from ..schemas import ClassifyRequest, ClassifyResponse
from ..services.classifier_service import classifier_service

router = APIRouter(prefix="/ai", tags=["AI Classification Module"])

@router.post("/classify-feedback", response_model=ClassifyResponse, summary="Classify Passenger Comment via AI Engine")
def classify_feedback_endpoint(request: ClassifyRequest):
    result = classifier_service.classify_comment(request.comment, request.ratings)
    return {
        "categories": result["categories"],
        "severity": result["severity"],
        "confidence": result["confidence"],
        "explanation": result["explanation"]
    }
