"""Application Configuration"""
from pydantic import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # API Configuration
    api_title: str = "Yolandita API"
    api_version: str = "0.1.0"
    debug: bool = False
    secret_key: str = "change-me-in-production"
    
    # Database
    database_url: str = "sqlite:///./yolandita.db"
    database_url_async: str = "sqlite+aiosqlite:///./yolandita.db"
    database_echo: bool = False
    database_pool_size: int = 5
    database_max_overflow: int = 10
    
    # CORS
    frontend_url: str = "http://localhost:3000"
    allowed_origins: list = ["http://localhost:3000", "http://localhost:3001", "http://localhost:8000"]
    
    # YOLOv8 Configuration
    yolo_model_path: str = "yolov8m"  # YOLO descargará automáticamente
    use_gpu: bool = False  # Usar GPU si está disponible
    yolo_confidence_threshold: float = 0.5
    yolo_iou_threshold: float = 0.45
    # Video Processing
    video_stream_timeout: int = 30
    max_concurrent_streams: int = 5
    frame_processing_interval: int = 500  # milliseconds
    
    # Alert Configuration
    alert_notification_email: str = "admin@yolandita.com"
    high_risk_threshold: float = 0.8
    medium_risk_threshold: float = 0.5
    
    # JWT Configuration
    access_token_expire_hours: int = 24
    refresh_token_expire_days: int = 7
    jwt_algorithm: str = "HS256"
    
    # AWS Configuration (Optional)
    aws_access_key_id: Optional[str] = None
    aws_secret_access_key: Optional[str] = None
    aws_region: str = "us-east-1"
    aws_s3_bucket: Optional[str] = None
    
    # Logging
    log_level: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
