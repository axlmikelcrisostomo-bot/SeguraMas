"""Synthetic Data for Testing and Development"""
from datetime import datetime, timedelta
import random
from typing import List, Dict, Any

# Datos sintéticos de cámaras
CAMERAS_DATA = [
    {
        "id": "cam-001",
        "name": "Cámara Puerta Principal",
        "location": "Entrada Principal",
        "status": "online",
        "ip_address": "192.168.1.101",
        "resolution": "1920x1080",
        "fps": 30,
        "streaming": True,
        "muted": False,
        "ptz": {"pan": 0, "tilt": 0, "zoom": 1.0},
        "lastSeen": datetime.now().isoformat(),
        "detectionEnabled": True,
        "recordingEnabled": True
    },
    {
        "id": "cam-002",
        "name": "Cámara Área de Ventas",
        "location": "Área de Ventas",
        "status": "online",
        "ip_address": "192.168.1.102",
        "resolution": "1920x1080",
        "fps": 30,
        "streaming": True,
        "muted": True,
        "ptz": {"pan": 45, "tilt": -10, "zoom": 1.5},
        "lastSeen": datetime.now().isoformat(),
        "detectionEnabled": True,
        "recordingEnabled": True
    },
    {
        "id": "cam-003",
        "name": "Cámara Mostrador",
        "location": "Mostrador",
        "status": "online",
        "ip_address": "192.168.1.103",
        "resolution": "2560x1440",
        "fps": 30,
        "streaming": False,
        "muted": False,
        "ptz": {"pan": 0, "tilt": -15, "zoom": 2.0},
        "lastSeen": (datetime.now() - timedelta(minutes=3)).isoformat(),
        "detectionEnabled": True,
        "recordingEnabled": True
    },
    {
        "id": "cam-004",
        "name": "Cámara Almacén",
        "location": "Almacén",
        "status": "online",
        "ip_address": "192.168.1.104",
        "resolution": "1920x1080",
        "fps": 25,
        "streaming": False,
        "muted": False,
        "ptz": {"pan": 90, "tilt": 0, "zoom": 1.0},
        "lastSeen": (datetime.now() - timedelta(minutes=15)).isoformat(),
        "detectionEnabled": True,
        "recordingEnabled": False
    },
    {
        "id": "cam-005",
        "name": "Cámara Estacionamiento",
        "location": "Estacionamiento",
        "status": "online",
        "ip_address": "192.168.1.105",
        "resolution": "1920x1080",
        "fps": 30,
        "streaming": True,
        "muted": True,
        "ptz": {"pan": -45, "tilt": -20, "zoom": 1.2},
        "lastSeen": datetime.now().isoformat(),
        "detectionEnabled": True,
        "recordingEnabled": True
    },
    {
        "id": "cam-006",
        "name": "Cámara Perímetro",
        "location": "Línea de Perímetro",
        "status": "offline",
        "ip_address": "192.168.1.106",
        "resolution": "1920x1080",
        "fps": 30,
        "streaming": False,
        "muted": False,
        "ptz": {"pan": 0, "tilt": 0, "zoom": 1.0},
        "lastSeen": (datetime.now() - timedelta(hours=2)).isoformat(),
        "detectionEnabled": False,
        "recordingEnabled": False
    }
]

# Datos sintéticos de incidentes
def generate_incidents(count: int = 50) -> List[Dict[str, Any]]:
    """Genera incidentes sintéticos"""
    incident_types = [
        "intrusion_detected",
        "suspicious_behavior",
        "perimeter_breach",
        "unauthorized_access",
        "loitering_detected",
        "object_left_behind",
        "crowd_formation",
        "motion_in_restricted_area"
    ]
    
    severities = ["low", "medium", "high", "critical"]
    statuses = ["active", "investigating", "resolved", "dismissed"]
    zones = ["Entrada Principal", "Área de Ventas", "Mostrador", "Almacén", "Estacionamiento", "Línea de Perímetro"]
    
    incidents = []
    
    for i in range(count):
        hours_ago = random.randint(0, 168)  # Últimos 7 días
        timestamp = datetime.now() - timedelta(hours=hours_ago)
        
        severity = random.choice(severities)
        incident_type = random.choice(incident_types)
        zone = random.choice(zones)
        camera_id = random.choice([cam["id"] for cam in CAMERAS_DATA])
        status = random.choice(statuses) if hours_ago > 1 else "active"
        
        # Determinar descripción basada en tipo
        descriptions = {
            "intrusion_detected": f"Intrusión detectada en {zone}. Persona no autorizada ingresó al área restringida.",
            "suspicious_behavior": f"Comportamiento sospechoso observado en {zone}. Requiere investigación.",
            "perimeter_breach": f"Violación del perímetro en {zone}. Sistema activado.",
            "unauthorized_access": f"Acceso no autorizado intentado en {zone}.",
            "loitering_detected": f"Persona merodeando detectada en {zone} durante período prolongado.",
            "object_left_behind": f"Objeto abandonado detectado en {zone}. Posible riesgo de seguridad.",
            "crowd_formation": f"Formación de multitud detectada en {zone}. Monitoreo activo.",
            "motion_in_restricted_area": f"Movimiento detectado en área restringida: {zone}."
        }
        
        incident = {
            "id": f"inc-{str(i+1).zfill(4)}",
            "timestamp": timestamp.isoformat(),
            "type": incident_type,
            "severity": severity,
            "status": status,
            "camera_id": camera_id,
            "zone": zone,
            "description": descriptions[incident_type],
            "confidence": round(random.uniform(0.75, 0.99), 2),
            "snapshot_url": f"/snapshots/{camera_id}/{timestamp.strftime('%Y%m%d_%H%M%S')}.jpg",
            "video_url": f"/videos/{camera_id}/{timestamp.strftime('%Y%m%d_%H%M%S')}.mp4" if severity in ["high", "critical"] else None,
            "resolved_at": (timestamp + timedelta(hours=random.randint(1, 24))).isoformat() if status == "resolved" else None,
            "assigned_to": random.choice(["Juan Pérez", "María García", "Carlos López", None]) if status in ["investigating", "resolved"] else None,
            "notes": "Investigación en curso" if status == "investigating" else "Resuelto - Falsa alarma" if status == "resolved" else None
        }
        
        incidents.append(incident)
    
    # Ordenar por timestamp descendente
    incidents.sort(key=lambda x: x["timestamp"], reverse=True)
    
    return incidents

# Datos sintéticos de detecciones en tiempo real
def generate_detections(camera_id: str, count: int = 10) -> List[Dict[str, Any]]:
    """Genera detecciones sintéticas para una cámara"""
    object_classes = ["person", "car", "truck", "backpack", "handbag", "suitcase", "bicycle", "motorcycle"]
    
    detections = []
    
    for i in range(count):
        seconds_ago = random.randint(0, 300)  # Últimos 5 minutos
        timestamp = datetime.now() - timedelta(seconds=seconds_ago)
        
        obj_class = random.choice(object_classes)
        
        detection = {
            "id": f"det-{camera_id}-{timestamp.strftime('%Y%m%d%H%M%S')}-{i}",
            "camera_id": camera_id,
            "timestamp": timestamp.isoformat(),
            "object_class": obj_class,
            "confidence": round(random.uniform(0.70, 0.98), 2),
            "bbox": {
                "x": random.randint(100, 800),
                "y": random.randint(50, 500),
                "width": random.randint(80, 300),
                "height": random.randint(120, 400)
            },
            "tracked": random.choice([True, False]),
            "track_id": f"track-{random.randint(1000, 9999)}" if random.choice([True, False]) else None
        }
        
        detections.append(detection)
    
    return detections

# Datos sintéticos de analíticas
def generate_analytics_data() -> Dict[str, Any]:
    """Genera datos de analíticas sintéticos"""
    
    # Generar datos por hora para las últimas 24 horas
    hourly_detections = []
    for i in range(24):
        hour = 23 - i
        base_count = 200
        if 6 <= hour <= 9:  # Mañana
            count = base_count + random.randint(100, 200)
        elif 12 <= hour <= 14:  # Mediodía
            count = base_count + random.randint(150, 250)
        elif 17 <= hour <= 20:  # Tarde/Noche
            count = base_count + random.randint(200, 400)
        else:  # Madrugada
            count = random.randint(20, 100)
        
        hourly_detections.append({
            "hour": f"{str(hour).zfill(2)}:00",
            "detections": count,
            "incidents": random.randint(0, 5) if count > 200 else random.randint(0, 2)
        })
    
    # Detecciones por zona
    zone_detections = [
        {"zone": "Entrada Principal", "detections": 1247, "risk_level": "critical", "trend": "+18%"},
        {"zone": "Área de Ventas", "detections": 2156, "risk_level": "critical", "trend": "+24%"},
        {"zone": "Mostrador", "detections": 1834, "risk_level": "high", "trend": "+15%"},
        {"zone": "Pasillo Norte", "detections": 456, "risk_level": "medium", "trend": "+8%"},
        {"zone": "Almacén", "detections": 178, "risk_level": "low", "trend": "-3%"},
        {"zone": "Estacionamiento", "detections": 892, "risk_level": "medium", "trend": "+12%"}
    ]
    
    # Detecciones por tipo de objeto
    object_detections = [
        {"class": "person", "count": 4521, "percentage": 68.5},
        {"class": "car", "count": 1245, "percentage": 18.9},
        {"class": "backpack", "count": 387, "percentage": 5.9},
        {"class": "handbag", "count": 234, "percentage": 3.5},
        {"class": "bicycle", "count": 156, "percentage": 2.4},
        {"class": "truck", "count": 52, "percentage": 0.8}
    ]
    
    # Estadísticas de cámaras
    camera_stats = []
    for cam in CAMERAS_DATA:
        uptime_hours = random.randint(168, 720)  # 7-30 días
        camera_stats.append({
            "camera_id": cam["id"],
            "camera_name": cam["name"],
            "status": cam["status"],
            "detections_today": random.randint(100, 800),
            "incidents_today": random.randint(0, 15),
            "uptime_hours": uptime_hours,
            "uptime_percentage": round((uptime_hours / 720) * 100, 1),
            "avg_fps": cam["fps"] - random.uniform(0, 2),
            "storage_gb": round(random.uniform(50, 500), 1)
        })
    
    return {
        "summary": {
            "total_detections_24h": sum([h["detections"] for h in hourly_detections]),
            "total_incidents_24h": sum([h["incidents"] for h in hourly_detections]),
            "active_cameras": len([c for c in CAMERAS_DATA if c["status"] == "online"]),
            "total_cameras": len(CAMERAS_DATA),
            "system_uptime_percentage": 99.2,
            "average_response_time_ms": 245
        },
        "hourly_detections": hourly_detections,
        "zone_detections": zone_detections,
        "object_detections": object_detections,
        "camera_stats": camera_stats,
        "alerts": {
            "critical": random.randint(2, 8),
            "high": random.randint(5, 15),
            "medium": random.randint(10, 30),
            "low": random.randint(15, 50)
        }
    }

# Datos de usuarios
USERS_DATA = [
    {
        "id": "user-001",
        "email": "demo@yolandita.com",
        "name": "Demo User",
        "role": "admin",
        "created_at": (datetime.now() - timedelta(days=180)).isoformat(),
        "last_login": datetime.now().isoformat(),
        "active": True,
        "permissions": ["read", "write", "delete", "admin"]
    },
    {
        "id": "user-002",
        "email": "juan.perez@yolandita.com",
        "name": "Juan Pérez",
        "role": "operator",
        "created_at": (datetime.now() - timedelta(days=90)).isoformat(),
        "last_login": (datetime.now() - timedelta(hours=2)).isoformat(),
        "active": True,
        "permissions": ["read", "write"]
    },
    {
        "id": "user-003",
        "email": "maria.garcia@yolandita.com",
        "name": "María García",
        "role": "operator",
        "created_at": (datetime.now() - timedelta(days=60)).isoformat(),
        "last_login": (datetime.now() - timedelta(hours=8)).isoformat(),
        "active": True,
        "permissions": ["read", "write"]
    },
    {
        "id": "user-004",
        "email": "carlos.lopez@yolandita.com",
        "name": "Carlos López",
        "role": "viewer",
        "created_at": (datetime.now() - timedelta(days=30)).isoformat(),
        "last_login": (datetime.now() - timedelta(days=3)).isoformat(),
        "active": True,
        "permissions": ["read"]
    },
    {
        "id": "user-005",
        "email": "admin@yolandita.com",
        "name": "Administrador",
        "role": "admin",
        "created_at": (datetime.now() - timedelta(days=365)).isoformat(),
        "last_login": (datetime.now() - timedelta(days=1)).isoformat(),
        "active": True,
        "permissions": ["read", "write", "delete", "admin", "config"]
    }
]

# Configuración del sistema
SYSTEM_CONFIG = {
    "detection": {
        "enabled": True,
        "confidence_threshold": 0.75,
        "model": "yolov8n",
        "classes_enabled": ["person", "car", "truck", "backpack", "handbag"],
        "detection_zones": ["all"],
        "save_detections": True
    },
    "alerts": {
        "enabled": True,
        "email_notifications": True,
        "sms_notifications": False,
        "push_notifications": True,
        "alert_cooldown_minutes": 5,
        "severity_threshold": "medium"
    },
    "storage": {
        "max_storage_gb": 1000,
        "retention_days": 30,
        "compression_enabled": True,
        "compression_level": "medium",
        "cloud_backup_enabled": False
    },
    "security": {
        "require_2fa": False,
        "session_timeout_minutes": 60,
        "password_expiry_days": 90,
        "audit_logging": True,
        "max_failed_logins": 5
    }
}

# Exportar datos
__all__ = [
    'CAMERAS_DATA',
    'USERS_DATA',
    'SYSTEM_CONFIG',
    'generate_incidents',
    'generate_detections',
    'generate_analytics_data'
]
