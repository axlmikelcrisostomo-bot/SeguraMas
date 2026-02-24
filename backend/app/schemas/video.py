"""Video Pydantic Schemas"""
from pydantic import BaseModel, HttpUrl, Field
from datetime import datetime
from typing import Optional, List


class VideoStreamStart(BaseModel):
    """Start video stream request"""
    camera_id: str = Field(..., min_length=1, max_length=50)
    stream_url: str = Field(..., description="RTSP, HTTP, or HTTPS stream URL")
    
    class Config:
        json_schema_extra = {
            "example": {
                "camera_id": "CAM-001",
                "stream_url": "rtsp://camera.local:554/stream"
            }
        }


class VideoStreamStop(BaseModel):
    """Stop video stream request"""
    camera_id: str = Field(..., min_length=1, max_length=50)


class VideoStreamResponse(BaseModel):
    """Video stream response"""
    message: str
    camera_id: str
    stream_url: Optional[str] = None
    timestamp: datetime
    status: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "Video stream started",
                "camera_id": "CAM-001",
                "stream_url": "rtsp://camera.local:554/stream",
                "timestamp": "2026-02-22T10:30:45.123456",
                "status": "processing"
            }
        }


class ActiveStreamInfo(BaseModel):
    """Active stream information"""
    camera_id: str
    stream_url: str
    started_at: datetime
    frame_count: int
    active: bool
    
    class Config:
        from_attributes = True


class ActiveStreamsResponse(BaseModel):
    """List of active streams"""
    streams: List[ActiveStreamInfo]
    total_active: int
