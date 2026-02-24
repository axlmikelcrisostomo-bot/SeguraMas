# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend (React/Vue)                         │
│                   Dashboard & User Interface                     │
└────────────────────┬────────────────────────────────────────────┘
                     │ REST API + WebSocket
┌────────────────────▼────────────────────────────────────────────┐
│                   FastAPI Backend (Python)                       │
├─────────────────────────────────────────────────────────────────┤
│  API Routes  │  Services  │  Database ORM  │  ML Integration    │
├─────────────────────────────────────────────────────────────────┤
│  • Video Management   │  Video Processor      │  PostgreSQL     │
│  • Incidents          │  YOLOv8 Detector      │  SQLAlchemy     │
│  • Analytics & ROI    │  Incident Logger      │  Models         │
│  • Health             │  Alert Service        │                 │
└────────────────────┬────────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
   ┌────▼───┐  ┌──────▼──┐  ┌─────▼──────┐
   │  Video │  │YOLOv8ML │  │ PostgreSQL  │
   │ Streams│  │  Model  │  │  Database   │
   └────────┘  └─────────┘  └─────────────┘
```

## Component Breakdown

### Backend Components

#### 1. **API Layer** (`app/api/routes/`)
- **health.py**: Service health checks
- **video.py**: Video stream management
- **incidents.py**: Incident CRUD operations
- **analytics.py**: ROI and analytics endpoints

#### 2. **Service Layer** (`app/services/`)
- **yolov8_detector.py**: Object detection and behavior classification
- **video_processor.py**: Video stream handling and frame extraction
- **incident_logger.py**: Incident database operations
- **alert_service.py**: Alert generation and notifications

#### 3. **Database Layer** (`app/database/`)
- **db.py**: SQLAlchemy session management
- **models.py**: ORM models for all entities
- **schemas.py**: Pydantic schemas for validation (future)

#### 4. **Utilities** (`app/utils/`)
- **validators.py**: Input validation
- **helpers.py**: Helper functions (ROI calculation, metrics)

### Frontend Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx         # Main dashboard
│   │   ├── VideoFeed.jsx         # Live video display
│   │   ├── AlertNotification.jsx # Alert display
│   │   ├── MetricsChart.jsx      # Analytics charts
│   │   └── HeatmapViewer.jsx     # Risk heatmap
│   ├── pages/
│   │   ├── Home.jsx              # Landing page
│   │   ├── Analytics.jsx         # ROI & metrics
│   │   ├── Incidents.jsx         # Incident list
│   │   └── Settings.jsx          # Configuration
│   ├── services/
│   │   ├── api.js                # API client
│   │   └── websocket.js          # WebSocket handler
│   └── App.jsx
├── package.json
└── tailwind.config.js
```

## Data Flow

### Video Detection Pipeline
```
1. Camera Stream (RTSP/HTTP)
    ↓
2. Video Processor (Frame Extraction)
    ↓
3. YOLOv8 Detector (Object Detection)
    ↓
4. Behavior Classifier (Risk Assessment)
    ↓
5. Incident Logger (Database)
    ↓
6. Alert Service (Notifications)
    ↓
7. Frontend Dashboard (User Notification)
```

### Data Models

#### Incident
- `id`: Unique identifier
- `camera_id`: Source camera
- `incident_type`: Type of incident
- `risk_level`: low/medium/high
- `timestamp`: When detected
- `user_confirmed`: User verification feedback

#### Detection
- `id`: Record ID
- `camera_id`: Source
- `class_name`: Object type (person, vehicle, etc.)
- `confidence`: Detection confidence score
- `box_coordinates`: Bounding box positions

#### Store
- `id`: Store identifier
- `name`: Business name
- `city`: Location
- `subscription_active`: Active status

#### Camera
- `id`: Camera identifier
- `store_id`: Associated store
- `name`: Camera name
- `location`: Zone description
- `stream_url`: Video source URL

## API Communication

### REST Endpoints

**Video Management**
```
POST /api/v1/video/stream/start
POST /api/v1/video/stream/stop
GET /api/v1/video/streams
```

**Incident Management**
```
POST /api/v1/incidents/report
GET /api/v1/incidents
GET /api/v1/incidents/{id}
PUT /api/v1/incidents/{id}/confirm
```

**Analytics**
```
GET /api/v1/analytics/roi
GET /api/v1/analytics/heatmap
GET /api/v1/analytics/detection-metrics
GET /api/v1/analytics/risk-patterns
```

### WebSocket Real-time Updates
```
WS /ws/video/{camera_id}
- Streaming frame data
- Detection results
- Alert notifications
```

## Security Considerations

1. **Authentication**: JWT tokens for API access (to implement)
2. **Authorization**: Role-based access control (RBAC)
3. **Data Encryption**: TLS for transport, encrypted at rest
4. **Rate Limiting**: API rate limits per user
5. **CORS**: Restricted origins configuration

## Scalability Strategy

1. **Horizontal Scaling**: Load balancer + multiple API instances
2. **Database**: Read replicas for analytics queries
3. **Message Queue**: Redis/RabbitMQ for async tasks
4. **Caching**: Redis cache for frequent queries
5. **CDN**: Edge servers for geographic distribution

## Future Enhancements

1. Multi-GPU support for faster processing
2. Custom model training per location
3. Integration with local law enforcement APIs
4. Advanced threat pattern recognition
5. Mobile app for alerts
6. 3rd-party camera integration (Hikvision, Axis, etc.)
