# Sistema de Análisis de Video con Tracking de Personas

## Características Implementadas

### 1. **Reconocimiento de Personas con IDs Persistentes**
- Cada persona detectada recibe un ID único: "Persona 1", "Persona 2", etc.
- El sistema mantiene un registro de cada persona durante todo el video
- El ID persiste aunque la persona salga temporalmente del frame

### 2. **Contador de Tiempo de Permanencia**
- Cada persona tiene un contador que muestra cuánto tiempo ha estado en pantalla
- Formato: `Mm Ss` (ej: "5m 32s")
- El contador se actualiza en tiempo real durante la reproducción del video

### 3. **Sistema de Riesgo Basado en Tiempo**
- **Bajo (< 1 minuto)**: Persona de paso
- **Medio (1-2 minutos)**: Persona permanece moderadamente
- **Alto (2-5 minutos)**: Permanencia prolongada, requiere vigilancia
- **Crítico (> 5 minutos)**: Riesgo alto de comportamiento sospechoso

### 4. **Visualización en Tiempo Real**
- **Reproductor de Video Integrado**: Similar a YouTube, sin necesidad de descargar
- **Marcas de Bounding Box**: Cada persona tiene un rectángulo de identificación
- **Etiquetas Dinámicas**: Muestran nombre y tiempo en pantalla
- **Indicadores Visuales**: Cambio de color según nivel de riesgo

### 5. **Panel de Seguimiento de Personas**
Muestra información detallada de cada persona:
- **Nombre**: Persona X (ID único)
- **Tiempo Total**: Duración en minutos y segundos
- **Frames Detectados**: Cantidad de frames donde apareció
- **Nivel de Riesgo**: Clasificación visual
- **Alertas**: Si supera 5 minutos, se marca como riesgo

## Cómo Funciona el Tracking

### Backend (Python)
```
PersonTracker Class
├── Detecta personas con YOLO
├── Calcula centroides de cada bounding box
├── Asocia nuevas detecciones con tracks existentes
├── Genera IDs únicos (Persona 1, Persona 2, etc.)
└── Calcula duración en pantalla
```

### Frontend (React)
```
VideoUpload Component
├── Sube video a backend
├── Backend procesa video y genera versión con anotaciones
├── Frontend reproduce video procesado con etiquetas
└── Panel muestra personas y estadísticas
```

## API Endpoints

### Upload y Análisis
**POST** `/api/v1/video/upload`
- Sube un video para análisis
- Retorna: `video_id`, `analysis` con personas detectadas

**GET** `/api/v1/video/video/{video_id}`
- Sirve el video procesado para reproducción en streaming
- Content-Type: `video/mp4`

**GET** `/api/v1/video/analysis/{video_id}`
- Obtiene análisis detallado del video

**DELETE** `/api/v1/video/{video_id}`
- Elimina video procesado

## Campos de Análisis Retornados

```json
{
  "success": true,
  "video_path": "ruta/al/video",
  "video_info": {
    "fps": 30,
    "width": 1280,
    "height": 720,
    "total_frames": 900,
    "duration_seconds": 30
  },
  "summary": {
    "total_persons": 5,
    "high_risk_persons": 1,
    "high_risk_frames": 45,
    "persons_tracked": [
      {
        "person_id": 1,
        "name": "Persona 1",
        "duration_seconds": 320.5,
        "duration_formatted": "5m 20s",
        "frames_detected": 180,
        "risk_level": "crítico"
      }
    ]
  }
}
```

## Niveles de Riesgo Visual

| Nivel | Color | Duración | Significado |
|-------|-------|----------|-------------|
| Bajo | Verde | < 1m | Persona de paso |
| Medio | Amarillo | 1-2m | Permanencia normal |
| Alto | Naranja | 2-5m | Vigilancia requerida |
| Crítico | Rojo | > 5m | Riesgo potencial |

## Características de Visualización

### En el Video Procesado
- Bounding box con color según riesgo
- Nombre: "Persona X"
- Tiempo: "5m 32s"
- Marca de riesgo si > 5 minutos

### En el Panel Lateral
- Lista de todas las personas
- Información expandida por persona
- Alertas visuales para riesgos
- Estadísticas generales

## Configuración

### Parámetros Ajustables (en `yolov8_detector.py`)
```python
# Distancia máxima para asociar detecciones (píxeles)
max_distance=50

# Frames máximos sin detección antes de cerrar track
max_frames_skip=30

# Tiempo para considerarse riesgo (segundos)
high_risk_threshold = 300  # 5 minutos
```

## Instalación de Dependencias

```bash
# Backend
pip install opencv-python ultralytics

# Frontend
npm install lucide-react
```

## Flujo de Uso

1. **Subir Video**: El usuario sube un video MP4, AVI o MOV
2. **Procesamiento**: Backend analiza cada frame con YOLO
3. **Tracking**: PersonTracker asigna IDs y calcula duración
4. **Generación**: Se crea video con anotaciones
5. **Reproducción**: Frontend muestra video en reproductor integrado
6. **Análisis**: Panel muestra personas, tiempos y riesgos

## Notas Técnicas

- **Rendimiento**: Procesa ~30 FPS en GPU, ~5 FPS en CPU
- **Almacenamiento**: Videos se guardan en `uploads/processed/`
- **Limpieza**: Los archivos permanecen hasta ser eliminados manualmente
- **Codec**: H.264 (mp4v) para máxima compatibilidad

## Próximas Mejoras Posibles

- [ ] Face Recognition para mejorar tracking
- [ ] Historial de videos procesados
- [ ] Exportar análisis a PDF
- [ ] Alertas en tiempo real en vivo (RTSP/HLS)
- [ ] Machine Learning para patrones de comportamiento
- [ ] Integración con alertas por email/SMS
