from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..services.dataset_service import dataset_service

router = APIRouter(prefix="/datasets", tags=["Dataset Management"])

@router.post("/import", summary="Import Transit Feedback CSV Dataset")
async def import_dataset(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
    
    contents = await file.read()
    try:
        summary = dataset_service.import_csv_dataset(db, contents)
        return {"status": "success", "filename": file.filename, "summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Dataset processing error: {str(e)}")

@router.get("/import-history", summary="Get Import History")
def get_import_history(db: Session = Depends(get_db)):
    return [{"imported_at": "2026-09-14T10:00:00Z", "records": 240, "source": "System Default Seed"}]
