# API Documentation

## Base URL
```
http://localhost:8000/api/v1
```

## Authentication
Currently, the API does not require authentication. This will be implemented in future phases.

---

## Endpoints

### Health Check

#### Get API Status
```
GET /health
```

**Response (200):**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-22T10:30:45.123456",
  "service": "Yolandita Backend"
}
```

#### Get Detailed Health
```
GET /health/detailed
```

**Response (200):**
```json
{
  "api": "operational",
  "database": "checking...",
  "yolov8": "ready",
  "timestamp": "2026-02-22T10:30:45.123456"
}
```

---

## Video Management

#### Start Video Stream
```
POST /video/stream/start

Content-Type: application/json

{
  "camera_id": "CAM-001",
  "stream_url": "rtsp://camera.local:554/stream"
}
```

**Response (200):**
```json
{
  "message": "Video stream started",
  "camera_id": "CAM-001",
  "stream_url": "rtsp://camera.local:554/stream",
  "timestamp": "2026-02-22T10:30:45.123456"
}
```

#### Stop Video Stream
```
POST /video/stream/stop

Content-Type: application/json

{
  "camera_id": "CAM-001"
}
```

**Response (200):**
```json
{
  "message": "Video stream stopped",
  "camera_id": "CAM-001",
  "timestamp": "2026-02-22T10:30:45.123456"
}
```

#### List Active Streams
```
GET /video/streams
```

**Response (200):**
```json
[
  {
    "camera_id": "CAM-001",
    "stream_url": "rtsp://camera.local:554/stream",
    "started_at": "2026-02-22T10:30:45.123456",
    "frame_count": 1523
  }
]
```

---

## Incident Management

#### Report Incident
```
POST /incidents/report

Content-Type: application/json

{
  "camera_id": "CAM-001",
  "incident_type": "suspicious_behavior",
  "risk_level": "high",
  "description": "Person loitering near entrance"
}
```

**Response (200):**
```json
{
  "id": "INC-ABC12345",
  "camera_id": "CAM-001",
  "incident_type": "suspicious_behavior",
  "risk_level": "high",
  "timestamp": "2026-02-22T10:30:45.123456",
  "status": "registered"
}
```

#### Get Incidents
```
GET /incidents?camera_id=CAM-001&risk_level=high&limit=50&offset=0
```

**Query Parameters:**
- `camera_id` (optional): Filter by camera
- `risk_level` (optional): Filter by risk level (low/medium/high)
- `limit` (optional): Results per page (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Response (200):**
```json
[
  {
    "id": "INC-ABC12345",
    "camera_id": "CAM-001",
    "incident_type": "suspicious_behavior",
    "risk_level": "high",
    "timestamp": "2026-02-22T10:30:45.123456",
    "status": "registered",
    "user_confirmed": null
  }
]
```

#### Get Incident Details
```
GET /incidents/{incident_id}
```

**Response (200):**
```json
{
  "id": "INC-ABC12345",
  "camera_id": "CAM-001",
  "incident_type": "suspicious_behavior",
  "risk_level": "high",
  "description": "Person loitering near entrance",
  "timestamp": "2026-02-22T10:30:45.123456",
  "status": "registered",
  "user_confirmed": null
}
```

#### Confirm Incident
```
PUT /incidents/{incident_id}/confirm

Content-Type: application/json

{
  "confirmed": true
}
```

**Response (200):**
```json
{
  "id": "INC-ABC12345",
  "confirmed": true,
  "updated_at": "2026-02-22T10:35:12.654321"
}
```

---

## Analytics & ROI

#### Get ROI Metrics
```
GET /analytics/roi?store_id=STORE-001&days=30
```

**Response (200):**
```json
{
  "store_id": "STORE-001",
  "period_days": 30,
  "gross_revenue_estimate": 100000,
  "shadow_tax_percentage": 0.10,
  "projected_losses": 10000,
  "subscription_cost": 299,
  "roi_percentage": 3162.21,
  "savings_achieved": 9701,
  "timestamp": "2026-02-22T10:30:45.123456"
}
```

#### Get Heatmap Data
```
GET /analytics/heatmap?camera_id=CAM-001&days=7
```

**Response (200):**
```json
{
  "camera_id": "CAM-001",
  "period_days": 7,
  "heatmap": "base64_encoded_image_data",
  "high_risk_zones": [
    {"x": 100, "y": 150, "intensity": 0.9},
    {"x": 250, "y": 300, "intensity": 0.7}
  ],
  "timestamp": "2026-02-22T10:30:45.123456"
}
```

#### Get Detection Metrics
```
GET /analytics/detection-metrics?camera_id=CAM-001&days=30
```

**Response (200):**
```json
{
  "camera_id": "CAM-001",
  "period_days": 30,
  "total_detections": 1523,
  "confirmed_detections": 1421,
  "false_positives": 102,
  "accuracy": 0.932,
  "precision": 0.945,
  "recall": 0.923,
  "timestamp": "2026-02-22T10:30:45.123456"
}
```

#### Get Risk Patterns
```
GET /analytics/risk-patterns?store_id=STORE-001&days=30
```

**Response (200):**
```json
{
  "store_id": "STORE-001",
  "peak_risk_hours": ["20:00-22:00", "02:00-04:00"],
  "risk_by_zone": {
    "entrance": 0.45,
    "storage": 0.65,
    "parking": 0.80,
    "checkout": 0.30
  },
  "equipment_concerns": ["loitering", "theft_attempts", "suspicious_vehicles"],
  "recommendations": [
    "Increase security during 20:00-22:00 hours",
    "Focus on parking area monitoring",
    "Review storage access protocols"
  ]
}
```

#### Get Operational Suggestions
```
GET /analytics/operational-suggestions?store_id=STORE-001
```

**Response (200):**
```json
{
  "store_id": "STORE-001",
  "suggestions": [
    {
      "type": "closing_time",
      "current": "22:00",
      "recommended": "21:30",
      "reason": "Crime peaks 20:00-22:00 in area"
    },
    {
      "type": "supply_route",
      "change": "Avoid main entrance during 20:00-22:00",
      "reason": "Highest detection activity period"
    }
  ]
}
```

---

## WebSocket

### Real-time Video Stream via WebSocket
```
WS ws://localhost:8000/ws/video/{camera_id}
```

**Connection:**
```javascript
const ws = new WebSocket('ws://localhost:8000/api/v1/ws/video/CAM-001');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Handle real-time detection data
};
```

**Expected Messages:**
```json
{
  "status": "processing",
  "camera_id": "CAM-001",
  "detections": [
    {
      "class_id": 0,
      "class_name": "person",
      "confidence": 0.95,
      "box": [100, 150, 200, 300]
    }
  ],
  "risk_level": "high"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid camera_id format"
}
```

### 404 Not Found
```json
{
  "detail": "Incident not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

---

## Rate Limiting
(To be implemented)

Expected headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1234567890
```

---

## Pagination
All list endpoints support pagination:

**Query Parameters:**
- `limit`: Items per page (default: 50, max: 500)
- `offset`: Starting position (default: 0)

**Response Headers:**
```
Content-Range: items 0-49/1523
```
