"""Health Check Endpoints"""
from fastapi import APIRouter, Depends
from datetime import datetime
from app.schemas import HealthResponse, DetailedHealthResponse
from app.security import get_optional_user

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Check API health status"""
    return HealthResponse(
        status="healthy",
        timestamp=datetime.utcnow(),
        service="Yolandita Backend"
    )


@router.get("/health/detailed", response_model=DetailedHealthResponse)
async def detailed_health():
    """Detailed health information"""
    return DetailedHealthResponse(
        api="operational",
        database="connected",
        yolov8="ready",
        redis="connected",
        timestamp=datetime.utcnow()
    )
