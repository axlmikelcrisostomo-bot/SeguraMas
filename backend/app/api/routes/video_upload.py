"""Endpoint para análisis de videos con YOLO"""
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse, StreamingResponse
import shutil
import os
from pathlib import Path
from datetime import datetime
import tempfile
from app.services.yolov8_detector import YOLOv8Detector

router = APIRouter()
detector = YOLOv8Detector()

# Directorio para videos subidos (ruta absoluta desde el directorio del backend)
BACKEND_DIR = Path(__file__).parent.parent.parent.parent  # go from: app/api/routes/video_upload.py -> backend/
UPLOAD_DIR = BACKEND_DIR / "uploads" / "videos"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

print(f"📁 UPLOAD_DIR configurado en: {UPLOAD_DIR}")
print(f"📁 ¿Existe la carpeta? {UPLOAD_DIR.exists()}")

# Directorio para videos procesados
PROCESSED_DIR = BACKEND_DIR / "uploads" / "processed"
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    """
    Subir y analizar video de cámara de seguridad
    
    Formatos soportados: mp4, avi, mov
    """
    # Validar formato
    allowed_extensions = [".mp4", ".avi", ".mov", ".mkv"]
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400, 
            detail=f"Formato no soportado. Use: {', '.join(allowed_extensions)}"
        )
    
    try:
        # Generar nombre único
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        input_filename = f"video_input_{timestamp}{file_ext}"
        input_path = UPLOAD_DIR / input_filename
        
        # Guardar archivo
        with input_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Generar nombre para video procesado
        output_filename = f"video_processed_{timestamp}.mp4"
        output_path = PROCESSED_DIR / output_filename
        
        # Procesar video con YOLO y tracking
        analysis = detector.process_video_with_tracking(str(input_path), str(output_path))
        
        if not analysis.get("success"):
            raise Exception(analysis.get("error", "Error procesando video"))
        
        return {
            "status": "success",
            "input_filename": input_filename,
            "output_filename": output_filename,
            "video_id": timestamp,
            "analysis": analysis
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error procesando video: {str(e)}")


@router.get("/video/{video_id}")
async def get_processed_video(video_id: str):
    """
    Servir video procesado para streaming
    """
    try:
        # Buscar archivo procesado
        output_filename = f"video_processed_{video_id}.mp4"
        output_path = PROCESSED_DIR / output_filename
        
        if not output_path.exists():
            raise HTTPException(status_code=404, detail="Video no encontrado")
        
        # Devolver video con headers para streaming
        return FileResponse(
            path=output_path,
            media_type="video/mp4",
            headers={
                "Content-Disposition": f"inline; filename={output_filename}",
                "Accept-Ranges": "bytes"
            }
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/analysis/{video_id}")
async def get_video_analysis(video_id: str):
    """Obtener análisis de video previamente procesado"""
    try:
        # Buscar archivo procesado
        output_filename = f"video_processed_{video_id}.mp4"
        output_path = PROCESSED_DIR / output_filename
        
        if not output_path.exists():
            raise HTTPException(status_code=404, detail="Video no encontrado")
        
        # Re-analizar
        analysis = detector.process_video_with_tracking(str(output_path))
        
        return {
            "status": "success",
            "video_id": video_id,
            "analysis": analysis
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/video/{video_id}")
async def delete_video(video_id: str):
    """Eliminar video procesado"""
    try:
        output_filename = f"video_processed_{video_id}.mp4"
        output_path = PROCESSED_DIR / output_filename
        
        if not output_path.exists():
            raise HTTPException(status_code=404, detail="Video no encontrado")
        
        os.remove(output_path)
        return {"status": "success", "message": f"Video {video_id} eliminado"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/test")
async def test_endpoint():
    """Endpoint de prueba para diagnosticar CORS"""
    files = list(UPLOAD_DIR.glob("*.mp4"))
    return {
        "status": "ok",
        "upload_dir": str(UPLOAD_DIR),
        "files_count": len(files),
        "files": [f.name for f in files[:5]]
    }


@router.get("/stream/{video_name}")
async def stream_camera_video(video_name: str):
    """Servir video de cámara para streaming"""
    try:
        video_path = UPLOAD_DIR / video_name
        
        print(f"🎬 Solicitando video: {video_name}")
        print(f"📁 Ruta completa: {video_path}")
        print(f"✓ ¿Existe? {video_path.exists()}")
        
        if not video_path.exists():
            raise HTTPException(status_code=404, detail=f"Video no encontrado: {video_name}")
        
        # Devolver video con headers para streaming
        response = FileResponse(
            path=video_path,
            media_type="video/mp4",
            headers={
                "Content-Disposition": f"inline; filename={video_name}",
                "Accept-Ranges": "bytes",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Range"
            }
        )
        return response
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
