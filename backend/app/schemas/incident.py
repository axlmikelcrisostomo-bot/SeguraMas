"""Incident Pydantic Schemas"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class RiskLevelEnum(str, Enum):
    """Risk level enumeration"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class IncidentTypeEnum(str, Enum):
    """Incident type enumeration"""
    SUSPICIOUS_BEHAVIOR = "suspicious_behavior"
    LOITERING = "loitering"
    THEFT_ATTEMPT = "theft_attempt"
    UNAUTHORIZED_ACCESS = "unauthorized_access"
    UNKNOWN = "unknown"


class IncidentCreate(BaseModel):
    """Create incident request"""
    camera_id: str = Field(..., min_length=1, max_length=50)
    incident_type: IncidentTypeEnum
    risk_level: RiskLevelEnum
    description: Optional[str] = Field(None, max_length=500)
    
    class Config:
        json_schema_extra = {
            "example": {
                "camera_id": "CAM-001",
                "incident_type": "suspicious_behavior",
                "risk_level": "high",
                "description": "Person loitering near entrance"
            }
        }


class IncidentUpdate(BaseModel):
    """Update incident request"""
    user_confirmed: Optional[bool] = None
    description: Optional[str] = Field(None, max_length=500)


class IncidentResponse(BaseModel):
    """Incident response"""
    id: str
    camera_id: str
    incident_type: str
    risk_level: str
    description: Optional[str]
    timestamp: datetime
    status: str
    user_confirmed: Optional[bool]
    
    class Config:
        from_attributes = True


class IncidentListResponse(BaseModel):
    """List of incidents with pagination"""
    items: List[IncidentResponse]
    total: int
    limit: int
    offset: int


class IncidentConfirm(BaseModel):
    """Confirm incident request"""
    confirmed: bool = Field(..., description="Whether incident was legitimate")
    
    class Config:
        json_schema_extra = {
            "example": {
                "confirmed": True
            }
        }
