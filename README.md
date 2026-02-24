#Intelligent Security Monitoring System

🔒 **Real-time Security Monitoring with YOLOv8 + SaaS Model**

Yolandita is an AI-powered security system that detects threats in real-time, quantifies loss prevention, and provides data-driven insights for retail businesses.

## 📋 Project Overview

### Core Features

1. **Real-time Video Processing** - YOLOv8 object detection on video streams
2. **Risk Assessment** - Predictive alerts for suspicious behavior patterns
3. **Incident Management** - Automatic logging and tracking of security events
4. **ROI Dashboard** - Calculate prevented losses vs. subscription cost
5. **Heatmaps & Analytics** - Visualize risk zones and operational patterns
6. **Continuous Learning** - User feedback to improve model accuracy

### Business Model
- **SaaS Monthly Subscription** - Convert CAPEX to OPEX
- **Affordable Access** - Democratize AI-powered security
- **Preventive Approach** - Show tangible ROI through prevented losses

## 🏗️ Project Structure

```
Proyecto Yolandita/
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── models/         # Data models
│   │   ├── services/       # Business logic
│   │   ├── database/       # ORM and database
│   │   ├── utils/          # Utility functions
│   │   ├── config.py       # Configuration
│   │   └── main.py         # Application entry
│   ├── tests/              # Unit and integration tests
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment template
├── frontend/               # React/Vue dashboard
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page components
│   │   └── services/       # API services
│   └── package.json
├── ml_models/              # ML-related files
│   ├── yolov8/            # YOLOv8 model files
│   └── training/          # Fine-tuning scripts
└── docs/                   # Documentation
```

## 🚀 Quick Start

### Backend Setup

1. **Install Python dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Initialize database:**
```bash
python -m alembic upgrade head
```

4. **Run application:**
```bash
python -m app.main
# API available at http://localhost:8000
```

### Frontend Setup

1. **Install Node dependencies:**
```bash
cd frontend
npm install
```

2. **Start development server:**
```bash
npm run dev
# UI available at http://localhost:3000
```

## 📚 API Endpoints

### Health Check
- `GET /api/v1/health` - Service status

### Video Management
- `POST /api/v1/video/stream/start` - Begin stream processing
- `POST /api/v1/video/stream/stop` - Stop stream
- `GET /api/v1/video/streams` - List active streams

### Incident Management
- `POST /api/v1/incidents/report` - Report incident
- `GET /api/v1/incidents` - List incidents
- `GET /api/v1/incidents/{id}` - Get incident details
- `PUT /api/v1/incidents/{id}/confirm` - Confirm incident

### Analytics & ROI
- `GET /api/v1/analytics/roi` - ROI metrics
- `GET /api/v1/analytics/heatmap` - Risk heatmap
- `GET /api/v1/analytics/detection-metrics` - Model metrics (Accuracy, Precision, Recall)
- `GET /api/v1/analytics/risk-patterns` - Risk analysis
- `GET /api/v1/analytics/operational-suggestions` - Data-driven recommendations

## 🔧 Configuration

See `.env.example` for all available settings:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/yolandita
YOLO_MODEL_PATH=./ml_models/yolov8/yolov8m.pt
YOLO_CONFIDENCE_THRESHOLD=0.5
HIGH_RISK_THRESHOLD=0.8
FRONTEND_URL=http://localhost:3000
```

## 💻 Technology Stack

**Backend:**
- FastAPI 0.104+
- SQLAlchemy ORM
- PostgreSQL
- Ultralytics YOLOv8
- PyTorch

**Frontend:**
- React 18+ (or Vue 3)
- Tailwind CSS
- Chart.js / Recharts

**Infrastructure:**
- Docker / Docker Compose
- AWS S3 (optional video storage)

## 📊 Key Metrics

- **Accuracy** - Overall detection accuracy
- **Precision** - False positive rate
- **Recall** - Detection sensitivity
- **ROI** - Prevented losses vs. subscription cost
- **Risk Score** - Probability of incident

## 🔄 Development Roadmap

1. ✅ Project structure setup
2. ⬜ Core API implementation
3. ⬜ Frontend dashboard
4. ⬜ Video processing pipeline
5. ⬜ Database schema optimization
6. ⬜ ML model fine-tuning
7. ⬜ Production deployment

## 📝 Contributing

Contributions welcome! Please follow:
- Python: PEP 8 style guide
- Commits: Conventional commit messages
- Tests: Maintain 80%+ coverage

## 📞 Support

For issues or questions, open a GitHub issue or contact the development team.

## 📄 License

Proprietary - Yolandita Security Systems

---

**Built with ❤️ for retail security**
