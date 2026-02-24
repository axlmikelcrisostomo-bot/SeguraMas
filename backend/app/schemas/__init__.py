"""Pydantic Schemas for request/response validation"""
from app.schemas.health import (
    HealthResponse,
    DetailedHealthResponse,
    ErrorResponse,
    SuccessResponse,
    AuthToken,
    UserLogin,
    UserRegister,
    UserResponse,
    TokenResponse,
    PaginationParams
)
from app.schemas.incident import (
    IncidentCreate,
    IncidentUpdate,
    IncidentResponse,
    IncidentListResponse,
    IncidentConfirm,
    RiskLevelEnum,
    IncidentTypeEnum
)
from app.schemas.video import (
    VideoStreamStart,
    VideoStreamStop,
    VideoStreamResponse,
    ActiveStreamInfo,
    ActiveStreamsResponse
)
from app.schemas.analytics import (
    ROIMetricsResponse,
    DetectionMetricsResponse,
    HeatmapResponse,
    RiskPatternsResponse,
    OperationalSuggestionsResponse,
    HotZone,
    RiskPattern,
    OperationalSuggestion
)

__all__ = [
    # Health
    "HealthResponse",
    "DetailedHealthResponse",
    "ErrorResponse",
    "SuccessResponse",
    "AuthToken",
    "UserLogin",
    "UserRegister",
    "UserResponse",
    "TokenResponse",
    "PaginationParams",
    # Incidents
    "IncidentCreate",
    "IncidentUpdate",
    "IncidentResponse",
    "IncidentListResponse",
    "IncidentConfirm",
    "RiskLevelEnum",
    "IncidentTypeEnum",
    # Video
    "VideoStreamStart",
    "VideoStreamStop",
    "VideoStreamResponse",
    "ActiveStreamInfo",
    "ActiveStreamsResponse",
    # Analytics
    "ROIMetricsResponse",
    "DetectionMetricsResponse",
    "HeatmapResponse",
    "RiskPatternsResponse",
    "OperationalSuggestionsResponse",
    "HotZone",
    "RiskPattern",
    "OperationalSuggestion",
]
