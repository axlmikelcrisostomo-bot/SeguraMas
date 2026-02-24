# Datos Sintéticos - Yolandita API

Este documento describe los datos sintéticos disponibles en la API para desarrollo y pruebas.

## 📡 Endpoints Disponibles

### Cámaras

#### `GET /api/v1/cameras`
Obtiene lista de todas las cámaras (6 cámaras)
```json
{
  "cameras": [
    {
      "id": "cam-001",
      "name": "Cámara Puerta Principal",
      "location": "Entrada Principal",
      "status": "online",
      "resolution": "1920x1080",
      "streaming": true,
      ...
    }
  ]
}
```

#### `GET /api/v1/cameras/{camera_id}`
Obtiene información de una cámara específica

#### `GET /api/v1/cameras/{camera_id}/detections`
Obtiene detecciones recientes de una cámara (últimos 20 eventos)

---

### Incidentes

#### `GET /api/v1/incidents`
Lista todos los incidentes (100 incidentes sintéticos)

**Query Parameters:**
- `camera_id` - Filtrar por cámara
- `severity` - Filtrar por severidad (low, medium, high, critical)
- `status` - Filtrar por estado (active, investigating, resolved, dismissed)
- `limit` - Límite de resultados (default: 50)
- `offset` - Offset para paginación (default: 0)

**Ejemplo:**
```
GET /api/v1/incidents?severity=critical&limit=10
```

#### `GET /api/v1/incidents/{incident_id}`
Obtiene detalles de un incidente específico

#### `PUT /api/v1/incidents/{incident_id}/status`
Actualiza el estado de un incidente

**Body:**
```json
{
  "status": "resolved"
}
```

---

### Analíticas

#### `GET /api/v1/analytics/dashboard`
Obtiene datos completos del dashboard de analíticas

**Respuesta incluye:**
- `summary` - Resumen general (detecciones 24h, incidentes, cámaras activas)
- `hourly_detections` - Detecciones por hora (últimas 24 horas)
- `zone_detections` - Detecciones por zona con nivel de riesgo
- `object_detections` - Detecciones por tipo de objeto
- `camera_stats` - Estadísticas por cámara
- `alerts` - Conteo de alertas por severidad

**Ejemplo de respuesta:**
```json
{
  "summary": {
    "total_detections_24h": 6160,
    "total_incidents_24h": 47,
    "active_cameras": 5,
    "total_cameras": 6
  },
  "zone_detections": [
    {
      "zone": "Entrada Principal",
      "detections": 1247,
      "risk_level": "critical",
      "trend": "+18%"
    }
  ],
  ...
}
```

---

### Usuarios

#### `GET /api/v1/users`
Lista todos los usuarios (5 usuarios)

#### `GET /api/v1/users/{user_id}`
Obtiene información de un usuario

#### `PUT /api/v1/users/{user_id}`
Actualiza información de usuario

**Body:**
```json
{
  "name": "Nuevo Nombre",
  "role": "admin",
  "active": true
}
```

#### `DELETE /api/v1/users/{user_id}`
Elimina un usuario

---

### Configuración

#### `GET /api/v1/config`
Obtiene configuración completa del sistema

**Secciones disponibles:**
- `detection` - Configuración de detección
- `alerts` - Configuración de alertas
- `storage` - Configuración de almacenamiento
- `security` - Configuración de seguridad

#### `GET /api/v1/config/{section}`
Obtiene una sección específica de configuración

**Ejemplo:**
```
GET /api/v1/config/detection
```

#### `PUT /api/v1/config/{section}`
Actualiza una sección de configuración

**Ejemplo:**
```json
PUT /api/v1/config/detection
{
  "confidence_threshold": 0.80,
  "enabled": true
}
```

---

## 📊 Datos Sintéticos Generados

### Cámaras (6 total)
1. **cam-001** - Puerta Principal (online, streaming)
2. **cam-002** - Área de Ventas (online, streaming)
3. **cam-003** - Mostrador (online)
4. **cam-004** - Almacén (online)
5. **cam-005** - Estacionamiento (online, streaming)
6. **cam-006** - Perímetro (offline)

### Incidentes (100 total)
- **Tipos:** intrusion_detected, suspicious_behavior, perimeter_breach, unauthorized_access, etc.
- **Severidades:** low, medium, high, critical
- **Estados:** active, investigating, resolved, dismissed
- **Rango temporal:** Últimos 7 días

### Detecciones
- **Clases de objetos:** person, car, truck, backpack, handbag, suitcase, bicycle, motorcycle
- **Confianza:** 0.70 - 0.98
- **Generadas dinámicamente** por cámara

### Usuarios (5 total)
1. **demo@yolandita.com** - Demo User (admin)
2. **juan.perez@yolandita.com** - Juan Pérez (operator)
3. **maria.garcia@yolandita.com** - María García (operator)
4. **carlos.lopez@yolandita.com** - Carlos López (viewer)
5. **admin@yolandita.com** - Administrador (admin)

---

## 🚀 Uso en Frontend

### Ejemplo: Obtener cámaras
```javascript
const response = await fetch('http://localhost:8000/api/v1/cameras');
const data = await response.json();
console.log(data.cameras);
```

### Ejemplo: Obtener incidentes críticos
```javascript
const response = await fetch('http://localhost:8000/api/v1/incidents?severity=critical&limit=10');
const data = await response.json();
console.log(data.incidents);
```

### Ejemplo: Obtener dashboard de analíticas
```javascript
const response = await fetch('http://localhost:8000/api/v1/analytics/dashboard');
const analytics = await response.json();
console.log(analytics.summary);
console.log(analytics.zone_detections);
```

---

## 🔧 Modificar Datos Sintéticos

Los datos sintéticos se encuentran en:
```
backend/app/data/synthetic_data.py
```

### Agregar más cámaras
Edita el array `CAMERAS_DATA`

### Cambiar número de incidentes
Modifica la llamada en `incidents.py`:
```python
SYNTHETIC_INCIDENTS = generate_incidents(100)  # Cambia el número
```

### Personalizar analíticas
Edita la función `generate_analytics_data()` en `synthetic_data.py`

---

## 📝 Notas

- Los datos son **volátiles** - se regeneran cada vez que se reinicia el servidor
- Los incidentes se generan aleatoriamente con distribución realista
- Las detecciones se generan dinámicamente cuando se solicitan
- Todos los endpoints responden sin necesidad de base de datos

---

## 🧪 Testing

Prueba los endpoints con curl:

```bash
# Listar cámaras
curl http://localhost:8000/api/v1/cameras

# Obtener incidentes críticos
curl "http://localhost:8000/api/v1/incidents?severity=critical"

# Dashboard de analíticas
curl http://localhost:8000/api/v1/analytics/dashboard

# Configuración del sistema
curl http://localhost:8000/api/v1/config
```

O visita la documentación interactiva:
```
http://localhost:8000/docs
```
