"""Video Stream and Processing Endpoints"""
from fastapi import APIRouter, WebSocket, HTTPException, status
from typing import List
from datetime import datetime
from app.schemas import (
    VideoStreamStart,
    VideoStreamStop,
    VideoStreamResponse,
    ActiveStreamsResponse,
    ActiveStreamInfo
)
from app.services.video_processor import VideoProcessor
from app.data import CAMERAS_DATA, generate_detections

router = APIRouter()
video_processor = VideoProcessor()


@router.get("/cameras")
async def get_cameras():
    """Obtener lista de todas las cámaras"""
    return {"cameras": CAMERAS_DATA}


@router.get("/cameras/{camera_id}")
async def get_camera(camera_id: str):
    """Obtener información de una cámara específica"""
    camera = next((cam for cam in CAMERAS_DATA if cam["id"] == camera_id), None)
    if not camera:
        raise HTTPException(status_code=404, detail="Cámara no encontrada")
    return camera


@router.get("/cameras/{camera_id}/detections")
async def get_camera_detections(camera_id: str):
    """Obtener detecciones recientes de una cámara"""
    camera = next((cam for cam in CAMERAS_DATA if cam["id"] == camera_id), None)
    if not camera:
        raise HTTPException(status_code=404, detail="Cámara no encontrada")
    
    detections = generate_detections(camera_id, count=20)
    return {"camera_id": camera_id, "detections": detections}


@router.post("/video/stream/start", response_model=VideoStreamResponse)
async def start_video_stream(request: VideoStreamStart):
    """Start processing video stream from camera"""
    return VideoStreamResponse(
        message="Video stream started",
        camera_id=request.camera_id,
        stream_url=request.stream_url,
        timestamp=datetime.utcnow(),
        status="processing"
    )


@router.post("/video/stream/stop", response_model=VideoStreamResponse)
async def stop_video_stream(request: VideoStreamStop):
    """Stop processing video stream"""
    video_processor.stop_stream(request.camera_id)
    return VideoStreamResponse(
        message="Video stream stopped",
        camera_id=request.camera_id,
        timestamp=datetime.utcnow()
    )


@router.get("/video/streams", response_model=ActiveStreamsResponse)
async def list_active_streams():
    """Get list of active video streams"""
    streams = []
    for camera_id, stats in video_processor.active_streams.items():
        if stats.get("active"):
            streams.append(ActiveStreamInfo(
                camera_id=camera_id,
                stream_url="",
                started_at=stats["started_at"],
                frame_count=stats["frame_count"],
                active=True
            ))
    
    return ActiveStreamsResponse(
        streams=streams,
        total_active=len(streams)
    )


@router.websocket("/ws/video/{camera_id}")
async def websocket_video_stream(websocket: WebSocket, camera_id: str):
    """WebSocket for real-time video frame data"""
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            # Process video frame
            await websocket.send_json({
                "status": "processing",
                "camera_id": camera_id,
                "timestamp": datetime.utcnow().isoformat()
            })
    except Exception as e:
        await websocket.close(code=1000)
