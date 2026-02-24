"""Analytics Pydantic Schemas"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime


class ROIMetricsResponse(BaseModel):
    """ROI calculation response"""
    store_id: str
    period_days: int
    gross_revenue_estimate: float
    shadow_tax_percentage: float
    projected_losses: float
    subscription_cost: float
    roi_percentage: float
    savings_achieved: float
    timestamp: datetime
    
    class Config:
        json_schema_extra = {
            "example": {
                "store_id": "STORE-001",
                "period_days": 30,
                "gross_revenue_estimate": 100000,
                "shadow_tax_percentage": 0.10,
                "projected_losses": 10000,
                "subscription_cost": 299,
                "roi_percentage": 3162.21,
                "savings_achieved": 9701,
                "timestamp": "2026-02-22T10:30:45.123456"
            }
        }


class DetectionMetricsResponse(BaseModel):
    """Detection accuracy metrics"""
    camera_id: str
    period_days: int
    total_detections: int
    confirmed_detections: int
    false_positives: int
    accuracy: float = Field(..., ge=0, le=1)
    precision: float = Field(..., ge=0, le=1)
    recall: float = Field(..., ge=0, le=1)
    f1_score: Optional[float] = Field(None, ge=0, le=1)
    timestamp: datetime
    
    class Config:
        json_schema_extra = {
            "example": {
                "camera_id": "CAM-001",
                "period_days": 30,
                "total_detections": 1523,
                "confirmed_detections": 1421,
                "false_positives": 102,
                "accuracy": 0.932,
                "precision": 0.945,
                "recall": 0.923,
                "f1_score": 0.934,
                "timestamp": "2026-02-22T10:30:45.123456"
            }
        }


class HotZone(BaseModel):
    """High risk zone in heatmap"""
    x: float
    y: float
    intensity: float = Field(..., ge=0, le=1)
    zone_name: Optional[str] = None


class HeatmapResponse(BaseModel):
    """Heatmap data response"""
    camera_id: str
    period_days: int
    heatmap_base64: Optional[str] = None
    high_risk_zones: List[HotZone]
    timestamp: datetime
    
    class Config:
        json_schema_extra = {
            "example": {
                "camera_id": "CAM-001",
                "period_days": 7,
                "heatmap_base64": "iVBORw0KGgoAAAANSUhEUgAA...",
                "high_risk_zones": [
                    {"x": 100, "y": 150, "intensity": 0.9, "zone_name": "Entrance"},
                    {"x": 250, "y": 300, "intensity": 0.7, "zone_name": "Parking"}
                ],
                "timestamp": "2026-02-22T10:30:45.123456"
            }
        }


class RiskPattern(BaseModel):
    """Risk pattern analysis"""
    peak_risk_hours: List[str]
    risk_by_zone: Dict[str, float]
    equipment_concerns: List[str]
    recommendations: List[str]


class RiskPatternsResponse(BaseModel):
    """Risk patterns and analysis"""
    store_id: str
    period_days: int
    patterns: RiskPattern
    timestamp: datetime


class OperationalSuggestion(BaseModel):
    """Operational optimization suggestion"""
    suggestion_type: str = Field(..., alias="type")
    current_value: Optional[str] = None
    recommended_value: Optional[str] = None
    change_description: Optional[str] = None
    reason: str
    impact_score: Optional[float] = None


class OperationalSuggestionsResponse(BaseModel):
    """Data-driven operational suggestions"""
    store_id: str
    suggestions: List[OperationalSuggestion]
    timestamp: datetime
