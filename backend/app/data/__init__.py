"""Data Package - Synthetic Data for Development"""
from .synthetic_data import (
    CAMERAS_DATA,
    USERS_DATA,
    SYSTEM_CONFIG,
    generate_incidents,
    generate_detections,
    generate_analytics_data
)

__all__ = [
    'CAMERAS_DATA',
    'USERS_DATA',
    'SYSTEM_CONFIG',
    'generate_incidents',
    'generate_detections',
    'generate_analytics_data'
]
