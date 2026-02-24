"""YOLOv8 Detection Service con Person Tracking y Face Recognition Simulado"""
import logging
import cv2
import numpy as np
from typing import List, Tuple, Dict, Optional
from collections import defaultdict
from datetime import datetime
import tempfile
from pathlib import Path
from app.config import settings

logger = logging.getLogger(__name__)


class PersonTracker:
    """Rastreador de personas con ID persistente y duración en pantalla"""
    
    def __init__(self, max_distance=50, max_frames_skip=30):
        """
        Inicializar tracker de personas
        
        Args:
            max_distance: Distancia máxima para asociar track con detección
            max_frames_skip: Frames máximos sin detección antes de cerrar track
        """
        self.tracks = {}  # {track_id: {centroid, bbox, name, start_frame, frames_count, color}}
        self.next_id = 1
        self.max_distance = max_distance
        self.max_frames_skip = max_frames_skip
        self.frame_count = 0
        
    def _get_centroid(self, bbox):
        """Calcular centroide del bounding box"""
        x1, y1, x2, y2 = bbox
        return ((x1 + x2) / 2, (y1 + y2) / 2)
    
    def _distance(self, pt1, pt2):
        """Calcular distancia euclidiana"""
        return np.sqrt((pt1[0] - pt2[0])**2 + (pt1[1] - pt2[1])**2)
    
    def update(self, detections):
        """
        Actualizar tracks con nuevas detecciones
        
        Args:
            detections: Lista de {bbox, confidence, class_name}
            
        Returns:
            Lista de tracks activos con IDs asignados
        """
        self.frame_count += 1
        
        if not detections:
            # Incrementar frames sin detección para tracks existentes
            for track_id in list(self.tracks.keys()):
                self.tracks[track_id]['frames_skip'] += 1
                if self.tracks[track_id]['frames_skip'] > self.max_frames_skip:
                    del self.tracks[track_id]
            return []
        
        # Calcular centroides de nuevas detecciones
        detection_centroids = [self._get_centroid(d['bbox']) for d in detections]
        
        # Asociar detecciones con tracks existentes
        matched = set()
        updated_detections = []
        
        for det_idx, (det, centroid) in enumerate(zip(detections, detection_centroids)):
            best_track = None
            best_distance = self.max_distance
            
            # Buscar track más cercano
            for track_id, track in self.tracks.items():
                if track_id in matched:
                    continue
                    
                dist = self._distance(centroid, track['centroid'])
                if dist < best_distance:
                    best_distance = dist
                    best_track = track_id
            
            if best_track is not None:
                # Actualizar track existente
                self.tracks[best_track]['centroid'] = centroid
                self.tracks[best_track]['bbox'] = det['bbox']
                self.tracks[best_track]['frames_count'] += 1
                self.tracks[best_track]['frames_skip'] = 0
                matched.add(best_track)
                
                updated_detections.append({
                    **det,
                    'track_id': best_track,
                    'name': self.tracks[best_track]['name'],
                    'duration_seconds': (self.tracks[best_track]['frames_count'] / 30),
                    'color': self.tracks[best_track]['color']
                })
            else:
                # Crear nuevo track
                person_id = self.next_id
                self.next_id += 1
                color = tuple(np.random.randint(0, 255, 3).tolist())
                
                self.tracks[person_id] = {
                    'centroid': centroid,
                    'bbox': det['bbox'],
                    'name': f'Persona {person_id}',
                    'start_frame': self.frame_count,
                    'frames_count': 1,
                    'frames_skip': 0,
                    'color': color
                }
                
                updated_detections.append({
                    **det,
                    'track_id': person_id,
                    'name': f'Persona {person_id}',
                    'duration_seconds': 0,
                    'color': color
                })
        
        # Remover tracks sin coincidencias
        for track_id in list(self.tracks.keys()):
            if track_id not in matched:
                self.tracks[track_id]['frames_skip'] += 1
                if self.tracks[track_id]['frames_skip'] > self.max_frames_skip:
                    del self.tracks[track_id]
        
        return updated_detections
    
    def get_summary(self, fps=30):
        """Obtener resumen de personas detectadas"""
        summary = []
        for track_id, track in self.tracks.items():
            duration = track['frames_count'] / fps
            risk = 'crítico' if duration > 300 else 'alto' if duration > 120 else 'medio' if duration > 60 else 'bajo'
            
            summary.append({
                'person_id': track_id,
                'name': track['name'],
                'duration_seconds': duration,
                'duration_formatted': f"{int(duration // 60)}m {int(duration % 60)}s",
                'frames_detected': track['frames_count'],
                'risk_level': risk
            })
        
        return sorted(summary, key=lambda x: x['duration_seconds'], reverse=True)


class YOLOv8Detector:
    """YOLOv8 Model Handler optimizado para Cámaras de Seguridad con Person Tracking"""
    
    def __init__(self):
        """Initialize YOLO detector optimizado para vigilancia"""
        try:
            from ultralytics import YOLO
            self.model = YOLO(settings.yolo_model_path)
            self.model.fuse()
            self.person_tracker = PersonTracker()
            logger.info("✅ YOLOv8 Model cargado con Person Tracker")
        except Exception as e:
            logger.error(f"❌ Error al cargar YOLOv8 model: {e}")
            self.model = None
            self.person_tracker = PersonTracker()
    
    def detect_objects(self, image_path: str, track: bool = False) -> Dict:
        """
        Detectar personas en imagen/video
        
        Args:
            image_path: Ruta a archivo de imagen o frame de video
            track: Activar tracking de objetos entre frames
            
        Returns:
            Dictionary con detecciones y scores de confianza
        """
        if not self.model:
            return {"error": "Modelo no cargado"}
        
        try:
            results = self.model(
                image_path,
                conf=0.5,
                iou=0.45,
                max_det=300,
                classes=[0],  # Solo personas
                verbose=False,
                device='0' if settings.use_gpu else 'cpu'
            )
            
            detections = []
            for result in results:
                if result.boxes:
                    for box in result.boxes:
                        x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                        conf = box.conf[0].item()
                        
                        detections.append({
                            'bbox': (int(x1), int(y1), int(x2), int(y2)),
                            'confidence': conf,
                            'class_name': 'person',
                            'class_id': 0
                        })
            
            return {"detections": detections, "success": True}
        
        except Exception as e:
            logger.error(f"Error en detect_objects: {e}")
            return {"error": str(e), "success": False}
    
    def process_video_with_tracking(self, video_path: str, output_path: Optional[str] = None) -> Dict:
        """
        Procesar video con tracking persistente de personas
        
        Args:
            video_path: Ruta al video de entrada
            output_path: Ruta para guardar video procesado (si None, genera temporal)
            
        Returns:
            Dict con análisis y ruta del video procesado
        """
        if not self.model:
            return {"error": "Modelo no cargado"}
        
        try:
            # Abrir video
            cap = cv2.VideoCapture(video_path)
            fps = int(cap.get(cv2.CAP_PROP_FPS)) or 30
            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            
            # Generar ruta de salida si no se proporciona
            if output_path is None:
                temp_dir = Path(tempfile.gettempdir()) / "yolandita_videos"
                temp_dir.mkdir(exist_ok=True)
                output_path = str(temp_dir / f"analyzed_{datetime.now().strftime('%Y%m%d_%H%M%S')}.mp4")
            
            # Crear directorio de salida si no existe
            output_dir = Path(output_path).parent
            output_dir.mkdir(parents=True, exist_ok=True)
            
            # Usar codec H.264 que es más rápido y compatible
            # Si falla, intentar con MJPEG
            try:
                fourcc = cv2.VideoWriter_fourcc(*'H264')
                out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
                
                if not out.isOpened():
                    logger.warning("H264 falló, intentando con MJPEG...")
                    fourcc = cv2.VideoWriter_fourcc(*'MJPG')
                    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
            except:
                # Fallback a MJPEG
                logger.warning("Usando MJPEG como fallback...")
                fourcc = cv2.VideoWriter_fourcc(*'MJPG')
                out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
            
            if not out.isOpened():
                logger.error(f"No se pudo abrir VideoWriter. Probando sin codec específico...")
                fourcc = -1  # Dejar que OpenCV elija
                out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
                
            if not out.isOpened():
                raise Exception(f"No se pudo crear VideoWriter para: {output_path}")
            
            self.person_tracker = PersonTracker()
            frame_idx = 0
            high_risk_frames = 0
            
            logger.info(f"Procesando video: {total_frames} frames a {fps} FPS")
            
            while True:
                ret, frame = cap.read()
                if not ret:
                    break
                
                frame_idx += 1
                
                # Log cada 50 frames para seguimiento
                if frame_idx % 50 == 0:
                    logger.info(f"Procesados {frame_idx}/{total_frames} frames ({int(100*frame_idx/total_frames)}%)")
                
                # Detectar personas cada frame
                results = self.model(
                    frame,
                    conf=0.5,
                    iou=0.45,
                    max_det=300,
                    classes=[0],  # Solo personas
                    verbose=False,
                    device='0' if settings.use_gpu else 'cpu'
                )
                
                # Extraer detecciones
                detections = []
                if results[0].boxes:
                    for box in results[0].boxes:
                        x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                        conf = box.conf[0].item()
                        
                        detections.append({
                            'bbox': (int(x1), int(y1), int(x2), int(y2)),
                            'confidence': conf,
                            'class_name': 'person'
                        })
                
                # Actualizar tracking
                tracked_detections = self.person_tracker.update(detections)
                
                # Dibujar en frame
                for det in tracked_detections:
                    x1, y1, x2, y2 = det['bbox']
                    name = det['name']
                    duration = det['duration_seconds']
                    color = det.get('color', (0, 255, 0))
                    
                    # Detectar riesgo por duración (convertir a int antes de comparar)
                    is_high_risk = int(duration) > 300  # Más de 5 minutos
                    if is_high_risk:
                        high_risk_frames += 1
                        color = (0, 0, 255)  # Rojo para alto riesgo
                    
                    # Dibujar bounding box
                    cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                    
                    # Dibujar etiqueta con nombre y duración
                    minutes = int(duration // 60)
                    seconds = int(duration % 60)
                    label = f"{name} {minutes}m {seconds}s"
                    
                    # Fondo para texto
                    label_size = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)[0]
                    cv2.rectangle(frame, (x1, y1 - label_size[1] - 4), (x1 + label_size[0], y1), color, -1)
                    cv2.putText(frame, label, (x1, y1 - 2), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
                
                # Escribir frame procesado
                success = out.write(frame)
                if not success:
                    logger.warning(f"Error escribiendo frame {frame_idx}")
            
            cap.release()
            out.release()
            
            # Generar resumen
            summary = self.person_tracker.get_summary(fps)
            
            return {
                "success": True,
                "video_path": output_path,
                "video_info": {
                    "fps": fps,
                    "width": width,
                    "height": height,
                    "total_frames": total_frames,
                    "duration_seconds": total_frames / fps
                },
                "summary": {
                    "total_persons": len(summary),
                    "high_risk_persons": sum(1 for p in summary if p['risk_level'] == 'crítico'),
                    "high_risk_frames": high_risk_frames,
                    "persons_tracked": summary
                }
            }
        
        except Exception as e:
            logger.error(f"Error en process_video_with_tracking: {e}")
            return {"error": str(e), "success": False}
    
    def process_video(self, video_path: str, output_path: Optional[str] = None, track: bool = True) -> Dict:
        """Wrapper para procesar video"""
        return self.process_video_with_tracking(video_path, output_path)
