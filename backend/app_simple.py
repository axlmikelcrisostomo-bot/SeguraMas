"""
FastAPI Simple - Sin YOLO, solo videos
Puerto: 8080
"""
from fastapi import FastAPI, HTTPException, Request, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pathlib import Path
import logging
from datetime import datetime
import shutil
from typing import Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create app
app = FastAPI(
    title="Yolandita Videos Simple",
    version="1.0.0",
    description="Simple video streaming - Sin YOLO"
)

# Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rutas
BACKEND_DIR = Path(__file__).parent
VIDEOS_DIR = BACKEND_DIR / "uploads" / "videos"
VIDEOS_DIR.mkdir(parents=True, exist_ok=True)

PROCESSED_DIR = BACKEND_DIR / "uploads" / "processed"
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

MOCK_INCIDENTS = [
    {
        "id": "INC-001",
        "type": "intrusion_detected",
        "severity": "high",
        "risk_level": "high",
        "status": "active",
        "zone": "Entrada principal",
        "description": "Persona detectada fuera de horario permitido.",
        "timestamp": "2026-02-23T21:15:00Z",
        "user_confirmed": None,
    },
    {
        "id": "INC-002",
        "type": "loitering",
        "severity": "medium",
        "risk_level": "medium",
        "status": "investigating",
        "zone": "Pasillo central",
        "description": "Permanencia prolongada detectada en pasillo central.",
        "timestamp": "2026-02-23T20:42:00Z",
        "user_confirmed": None,
    },
    {
        "id": "INC-003",
        "type": "unauthorized_access",
        "severity": "critical",
        "risk_level": "high",
        "status": "resolved",
        "zone": "Caja 2",
        "description": "Acceso no autorizado detectado y contenido por seguridad.",
        "timestamp": "2026-02-23T19:05:00Z",
        "user_confirmed": True,
    },
    {
        "id": "INC-004",
        "type": "camera_occlusion",
        "severity": "low",
        "risk_level": "low",
        "status": "resolved",
        "zone": "Bodega",
        "description": "Obstrucción parcial de cámara detectada y corregida.",
        "timestamp": "2026-02-23T18:30:00Z",
        "user_confirmed": True,
    },
]

MOCK_HOURLY_DETECTIONS = [
    {"hour": "00:00", "incidents": 1, "detections": 8},
    {"hour": "04:00", "incidents": 0, "detections": 4},
    {"hour": "08:00", "incidents": 2, "detections": 18},
    {"hour": "12:00", "incidents": 3, "detections": 26},
    {"hour": "16:00", "incidents": 2, "detections": 21},
    {"hour": "20:00", "incidents": 1, "detections": 14},
    {"hour": "23:00", "incidents": 1, "detections": 9},
]

logger.info(f"📁 Videos directory: {VIDEOS_DIR}")
logger.info(f"✓ Directory exists: {VIDEOS_DIR.exists()}")

# Mock cameras data
@app.get("/api/v1/cameras")
async def get_cameras():
    """Get list of cameras with video URLs"""
    cameras = [
        {
            "id": f"cam-{i+1:03d}",
            "location": f"Cámara {i+1}",
            "status": "online",
            "fps": 30,
            "lastSeen": "2024-01-01T00:00:00Z",
            "detections": 0,
        }
        for i in range(6)
    ]
    return {"status": "success", "cameras": cameras}

# Health check
@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/api/v1/incidents")
async def get_incidents(limit: Optional[int] = 50):
    """Listado simple de incidentes para frontend"""
    safe_limit = limit if isinstance(limit, int) and limit > 0 else 50
    incidents = sorted(MOCK_INCIDENTS, key=lambda item: item["timestamp"], reverse=True)
    return {
        "status": "success",
        "count": min(len(incidents), safe_limit),
        "incidents": incidents[:safe_limit],
    }


@app.get("/api/v1/analytics/dashboard")
async def get_dashboard_analytics():
    """Datos de analítica para el panel general"""
    total_incidents = len(MOCK_INCIDENTS)
    total_detections = sum(item["detections"] for item in MOCK_HOURLY_DETECTIONS)

    return {
        "status": "success",
        "summary": {
            "total_incidents_24h": total_incidents,
            "active_cameras": 4,
            "total_cameras": 6,
            "total_detections_24h": total_detections,
        },
        "hourly_detections": MOCK_HOURLY_DETECTIONS,
    }


def _find_processed_file(video_id: str):
    matches = list(PROCESSED_DIR.glob(f"video_processed_{video_id}.*"))
    if not matches:
        return None
    return matches[0]


@app.post("/api/v1/video/upload")
async def upload_video(file: UploadFile = File(...)):
    """Subida simple de video sin procesamiento YOLO"""
    file_ext = Path(file.filename).suffix.lower()
    allowed_extensions = [".mp4", ".mov", ".avi", ".mkv"]

    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Formato no soportado. Use: {', '.join(allowed_extensions)}"
        )

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    input_filename = f"video_input_{timestamp}{file_ext}"
    input_path = VIDEOS_DIR / input_filename

    try:
        with input_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        output_filename = f"video_processed_{timestamp}{file_ext}"
        output_path = PROCESSED_DIR / output_filename
        shutil.copyfile(input_path, output_path)

        return {
            "status": "success",
            "video_id": timestamp,
            "input_filename": input_filename,
            "output_filename": output_filename,
            "video_info": {
                "duration_seconds": 0,
                "fps": 0,
                "width": 0,
                "height": 0,
                "total_frames": 0,
            },
            "summary": {
                "total_persons": 0,
                "high_risk_persons": 0,
                "high_risk_frames": 0,
                "persons_tracked": [],
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error subiendo video: {str(e)}")


@app.get("/api/v1/video/video/{video_id}")
async def get_uploaded_video(video_id: str):
    """Servir video subido para reproducción en frontend"""
    video_path = _find_processed_file(video_id)
    if not video_path:
        raise HTTPException(status_code=404, detail="Video no encontrado")

    return FileResponse(
        path=video_path,
        media_type="video/mp4",
        headers={
            "Content-Disposition": f"inline; filename={video_path.name}",
            "Accept-Ranges": "bytes",
            "Access-Control-Allow-Origin": "*",
        }
    )

# Video streaming endpoint
@app.get("/api/v1/video/stream/{video_name}")
async def stream_video(video_name: str, request: Request):
    """Stream video file"""
    video_path = VIDEOS_DIR / video_name
    
    logger.info(f"🎬 Request: {video_name}")
    logger.info(f"📁 Full path: {video_path}")
    logger.info(f"✓ Exists: {video_path.exists()}")
    
    if not video_path.exists():
        logger.error(f"❌ Video not found: {video_name}")
        raise HTTPException(status_code=404, detail=f"Video not found: {video_name}")
    
    try:
        return FileResponse(
            path=video_path,
            media_type="video/mp4",
            headers={
                "Content-Disposition": f"inline; filename={video_name}",
                "Accept-Ranges": "bytes",
                "Access-Control-Allow-Origin": "*",
            }
        )
    except Exception as e:
        logger.error(f"❌ Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Test endpoint
@app.get("/api/v1/video/test")
async def test():
    """Test endpoint to list available videos"""
    files = list(VIDEOS_DIR.glob("*.mp4"))
    return {
        "status": "ok",
        "upload_dir": str(VIDEOS_DIR),
        "files_count": len(files),
        "files": [f.name for f in files[:10]]
    }

# Root
@app.get("/")
async def root():
    return {"message": "Yolandita Videos Simple", "status": "running"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080, reload=True)
