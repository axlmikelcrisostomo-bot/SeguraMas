"""Health and Common Pydantic Schemas"""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Any


class HealthResponse(BaseModel):
    """Health check response"""
    status: str = Field(..., description="Service status")
    timestamp: datetime
    service: str = Field(..., description="Service name")
    
    class Config:
        json_schema_extra = {
            "example": {
                "status": "healthy",
                "timestamp": "2026-02-22T10:30:45.123456",
                "service": "Yolandita Backend"
            }
        }


class DetailedHealthResponse(BaseModel):
    """Detailed health check response"""
    api: str = Field(..., description="API status")
    database: str = Field(..., description="Database status")
    yolov8: str = Field(..., description="YOLOv8 model status")
    redis: Optional[str] = None
    timestamp: datetime
    
    class Config:
        json_schema_extra = {
            "example": {
                "api": "operational",
                "database": "connected",
                "yolov8": "ready",
                "redis": "connected",
                "timestamp": "2026-02-22T10:30:45.123456"
            }
        }


class ErrorResponse(BaseModel):
    """Standard error response"""
    error: str = Field(..., description="Error message")
    code: str = Field(..., description="Error code")
    details: Optional[Any] = None
    timestamp: datetime
    path: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "error": "Invalid request",
                "code": "INVALID_INPUT",
                "details": {"camera_id": "This field is required"},
                "timestamp": "2026-02-22T10:30:45.123456",
                "path": "/api/v1/incidents/report"
            }
        }


class SuccessResponse(BaseModel):
    """Standard success response wrapper"""
    success: bool = True
    message: str
    data: Optional[Any] = None
    timestamp: datetime


class PaginationParams(BaseModel):
    """Pagination parameters"""
    limit: int = Field(50, ge=1, le=500)
    offset: int = Field(0, ge=0)


class AuthToken(BaseModel):
    """Authentication token response"""
    access_token: str
    token_type: str = "bearer"
    expires_in: int = Field(..., description="Expiration time in seconds")
    
    class Config:
        json_schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIs...",
                "token_type": "bearer",
                "expires_in": 3600
            }
        }


class UserLogin(BaseModel):
    """User login request"""
    email: str = Field(..., description="User email")
    password: str = Field(..., min_length=8, description="Password")


class UserRegister(BaseModel):
    """User registration request"""
    email: str = Field(..., description="User email")
    password: str = Field(..., min_length=8, description="Password")
    full_name: str = Field(..., min_length=2, max_length=100)
    store_name: str = Field(..., min_length=2, max_length=100)

class UserResponse(BaseModel):
    """User response model"""
    id: Optional[int] = None
    email: str
    name: Optional[str] = None
    role: str = "user"
    
    class Config:
        orm_mode = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "email": "user@example.com",
                "name": "John Doe",
                "role": "user"
            }
        }


class TokenResponse(BaseModel):
    """Token response model"""
    access_token: str
    token_type: str = "bearer"
    expires_in: int = Field(..., description="Expiration time in seconds")
    user: Optional[UserResponse] = None
    
    class Config:
        orm_mode = True
        json_schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIs...",
                "token_type": "bearer",
                "expires_in": 3600,
                "user": {
                    "id": 1,
                    "email": "user@example.com",
                    "name": "John Doe",
                    "role": "user"
                }
            }
        }