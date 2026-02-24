"""Analytics and ROI Dashboard Endpoints"""
from fastapi import APIRouter, Query
from datetime import datetime
from typing import Optional
from app.schemas import (
    ROIMetricsResponse,
    DetectionMetricsResponse,
    HeatmapResponse,
    RiskPatternsResponse,
    OperationalSuggestionsResponse,
    HotZone,
    RiskPattern,
    OperationalSuggestion
)
from app.utils.helpers import calculate_roi, calculate_detection_metrics
from app.data import generate_analytics_data

router = APIRouter()


@router.get("/analytics/dashboard")
async def get_analytics_dashboard():
    """Obtener datos completos del dashboard de analíticas"""
    return generate_analytics_data()


@router.get("/analytics/roi", response_model=ROIMetricsResponse)
async def get_roi_metrics(
    store_id: str = Query(...),
    days: int = Query(30, ge=1, le=365)
):
    """Calculate ROI metrics based on prevented losses"""
    roi_calc = calculate_roi(
        gross_revenue=100000,
        shadow_tax_percentage=0.10,
        subscription_cost=299,
        days=days
    )
    
    return ROIMetricsResponse(
        store_id=store_id,
        period_days=days,
        gross_revenue_estimate=roi_calc["gross_revenue"],
        shadow_tax_percentage=roi_calc["shadow_tax_percentage"],
        projected_losses=roi_calc["projected_losses"],
        subscription_cost=roi_calc["subscription_cost"],
        roi_percentage=roi_calc["roi_percentage"],
        savings_achieved=roi_calc["net_savings"],
        timestamp=datetime.utcnow()
    )


@router.get("/analytics/heatmap", response_model=HeatmapResponse)
async def get_heatmap_data(
    camera_id: str = Query(...),
    days: int = Query(7, ge=1, le=90)
):
    """Get hotspot detection heatmap data"""
    high_risk_zones = [
        HotZone(x=100, y=150, intensity=0.9, zone_name="Entrance"),
        HotZone(x=250, y=300, intensity=0.7, zone_name="Parking"),
        HotZone(x=400, y=200, intensity=0.5, zone_name="Storage"),
    ]
    
    return HeatmapResponse(
        camera_id=camera_id,
        period_days=days,
        high_risk_zones=high_risk_zones,
        timestamp=datetime.utcnow()
    )


@router.get("/analytics/detection-metrics", response_model=DetectionMetricsResponse)
async def get_detection_metrics(
    camera_id: str = Query(...),
    days: int = Query(30, ge=1, le=365)
):
    """Get detection accuracy metrics (Accuracy, Precision, Recall)"""
    metrics = calculate_detection_metrics(
        total_detections=1523,
        true_positives=1421,
        false_positives=102,
        false_negatives=0
    )
    
    return DetectionMetricsResponse(
        camera_id=camera_id,
        period_days=days,
        total_detections=metrics["total_detections"],
        confirmed_detections=metrics["true_positives"],
        false_positives=metrics["false_positives"],
        accuracy=metrics["accuracy"],
        precision=metrics["precision"],
        recall=metrics["recall"],
        f1_score=metrics["f1_score"],
        timestamp=datetime.utcnow()
    )


@router.get("/analytics/risk-patterns", response_model=RiskPatternsResponse)
async def get_risk_patterns(
    store_id: str = Query(...),
    days: int = Query(30, ge=1, le=365)
):
    """Identify risk patterns and trends"""
    pattern = RiskPattern(
        peak_risk_hours=["20:00-22:00", "02:00-04:00"],
        risk_by_zone={
            "entrance": 0.45,
            "storage": 0.65,
            "parking": 0.80,
            "checkout": 0.30
        },
        equipment_concerns=["loitering", "theft_attempts", "suspicious_vehicles"],
        recommendations=[
            "Increase security during 20:00-22:00 hours",
            "Focus on parking area monitoring",
            "Review storage access protocols"
        ]
    )
    
    return RiskPatternsResponse(
        store_id=store_id,
        period_days=days,
        patterns=pattern,
        timestamp=datetime.utcnow()
    )


@router.get("/analytics/operational-suggestions", response_model=OperationalSuggestionsResponse)
async def get_operational_suggestions(store_id: str = Query(...)):
    """Get data-driven suggestions for store optimization"""
    suggestions = [
        OperationalSuggestion(
            type="closing_time",
            current_value="22:00",
            recommended_value="21:30",
            reason="Crime peaks 20:00-22:00 in area",
            impact_score=0.85
        ),
        OperationalSuggestion(
            type="supply_route",
            change_description="Avoid main entrance during 20:00-22:00",
            reason="Highest detection activity period",
            impact_score=0.70
        )
    ]
    
    return OperationalSuggestionsResponse(
        store_id=store_id,
        suggestions=suggestions,
        timestamp=datetime.utcnow()
    )
