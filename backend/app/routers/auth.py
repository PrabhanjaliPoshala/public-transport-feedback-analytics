from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import AdminModel
from ..schemas import LoginRequest, TokenResponse
from ..dependencies import verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse, summary="Admin Operations Login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    admin = db.query(AdminModel).filter(AdminModel.email == request.email).first()
    if not admin or not verify_password(request.password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    access_token = create_access_token(data={"sub": admin.email, "role": admin.role})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "email": admin.email,
        "role": admin.role
    }
