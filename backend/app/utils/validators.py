"""Input validation utilities"""
import re
from typing import Optional


def validate_camera_id(camera_id: str) -> bool:
    """Validate camera ID format"""
    return bool(re.match(r"^CAM-[A-Z0-9]{8}$", camera_id)) or len(camera_id) > 0


def validate_risk_level(risk_level: str) -> bool:
    """Validate risk level values"""
    return risk_level.lower() in ["low", "medium", "high", "critical"]


def validate_incident_type(incident_type: str) -> bool:
    """Validate incident type"""
    valid_types = [
        "suspicious_behavior",
        "loitering",
        "theft_attempt",
        "unauthorized_access",
        "unknown"
    ]
    return incident_type.lower() in valid_types


def validate_stream_url(url: str) -> bool:
    """Validate video stream URL"""
    url_pattern = r"^(http|https|rtsp)://[^\s/$.?#].[^\s]*$"
    return bool(re.match(url_pattern, url))


def validate_email(email: str) -> bool:
    """Validate email format"""
    email_pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return bool(re.match(email_pattern, email))
