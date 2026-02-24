# 🔒 Yolandita - AI-Powered Security System

> Real-time threat detection and prevention using YOLOv8 for modern retail and commercial spaces.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Development](#development)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Technologies](#technologies)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**Yolandita** is a comprehensive AI-powered security platform that transforms retail and commercial spaces into intelligent security systems. Using cutting-edge YOLOv8 object detection, it provides:

✅ **Real-time Detection** - Immediate threat identification  
✅ **ROI Optimization** - Quantifiable loss prevention  
✅ **Heatmap Analytics** - Zone-based risk visualization  
✅ **Multi-camera Support** - Scalable monitoring  
✅ **User Management** - Role-based access control  
✅ **Dashboard** - Real-time metrics and insights  

### 5 Core Pillars

1. **Detection Engine** - YOLOv8 real-time video analysis
2. **CAPEX→OPEX** - SaaS business model with transparent ROI
3. **ROI Dashboard** - Quantify security investments
4. **Data Analytics** - Heatmaps and pattern recognition
5. **Continuous Learning** - Feedback loop for model improvement

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                   Frontend (React 18)                     │
│   ├─ Pages: Home, Analytics, Incidents, Cameras, Settings│
│   ├─ Components: Dashboard, VideoFeed, Heatmap           │
│   └─ State: Zustand stores (Auth, Incidents, Metrics)    │
└──────────────────┬───────────────────────────────────────┘
                   │ (Axios, REST)
┌──────────────────▼───────────────────────────────────────┐
│            Backend API (FastAPI 0.104+)                   │
│   ├─ Routes: /health, /video, /incidents, /analytics     │
│   ├─ Auth: JWT + Bcrypt (Bearer tokens)                  │
│   ├─ Middleware: Logging, Rate Limiting, CORS            │
│   └─ ML: YOLOv8 integration ready                         │
└──────────────────┬───────────────────────────────────────┘
                   │ (SQLAlchemy, AsyncPG)
┌──────────────────▼───────────────────────────────────────┐
│              Data Layer (PostgreSQL)                       │
│   ├─ Tables: Stores, Cameras, Incidents, Detections      │
│   ├─ Migrationsalembic system                            │
│   └─ Relationships: Proper FKs and indexes               │
└──────────────────────────────────────────────────────────┘
```

---

## ⚡ Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- Python 3.11+
- PostgreSQL 16 (or use Docker)

### 1. Clone & Setup

```bash
# Clone repository
git clone https://github.com/yourusername/yolandita.git
cd yolandita

# Copy environment file
cp .env.example .env

# Update .env with your settings
nano .env
```

### 2. One-Command Deployment

```bash
# Make script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

This will:
- ✅ Check prerequisites
- ✅ Build Docker images
- ✅ Start all services (DB, Cache, Backend, Frontend)
- ✅ Run migrations
- ✅ Display service URLs

### 3. Access Application

```
🌐 Frontend:  http://localhost:3000
📡 Backend:   http://localhost:8000
📚 API Docs:  http://localhost:8000/docs
📊 Database:  localhost:5432
```

### 4. Default Credentials

```
Email:    admin@store.com
Password: password123
```

---

## 📦 Installation

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
alembic upgrade head

# Create superuser (optional)
python scripts/create_superuser.py

# Run server
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 🛠️ Development

### Backend Development

```bash
# Install dev dependencies
pip install -r requirements-dev.txt

# Run tests
pytest tests/ -v

# Run with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Check code quality
flake8 app/
mypy app/
black app/ --check
```

### Frontend Development

```bash
# Start dev server with HMR
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

### Database Migrations

```bash
# Create new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1

# View migration history
alembic history
```

---

## 📚 API Documentation

### Authentication

All endpoints (except `/api/health` and `/login`) require JWT token in header:

```
Authorization: Bearer <token>
```

### POST /auth/login
Login with email and password

```json
{
  "email": "admin@store.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "admin@store.com",
    "name": "Admin User"
  }
}
```

---

### GET /api/health
Health check endpoint

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-02-22T15:30:00Z"
}
```

---

### GET /api/incidents
Get all incidents

**Query Parameters:**
- `risk_level`: HIGH, MEDIUM, LOW (optional)
- `status`: open, resolved (optional)
- `limit`: 1-500 (default: 50)

**Response:**
```json
{
  "incidents": [
    {
      "id": 1,
      "camera_id": "CAM-001",
      "incident_type": "intrusion",
      "risk_level": "HIGH",
      "description": "Unauthorized entry detected",
      "status": "open",
      "timestamp": "2024-02-22T15:30:00Z",
      "user_confirmed": false
    }
  ]
}
```

---

### POST /api/incidents
Create new incident

```json
{
  "camera_id": "CAM-001",
  "incident_type": "intrusion",
  "risk_level": "HIGH",
  "description": "Unauthorized entry detected",
  "detection_data": {
    "confidence": 0.95,
    "class": "Unknown Person"
  }
}
```

---

### GET /api/analytics/roi
Get ROI metrics

**Query Parameters:**
- `store_id`: STORE-001 (required)
- `period_days`: 1-500 (default: 30)

**Response:**
```json
{
  "roi_percentage": 3162.21,
  "savings_achieved": 9701,
  "projected_losses": 10000,
  "subscription_cost": 299,
  "payback_days": 10
}
```

---

### GET /api/analytics/heatmap
Get zone heatmap data

**Response:**
```json
{
  "zones": [
    {
      "id": "zone-1",
      "name": "Entrance",
      "detections": 245,
      "risk_level": "HIGH"
    }
  ]
}
```

---

## 🚀 Deployment

### Docker Compose Deployment

```bash
# Start all services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend

# Rebuild after code changes
docker-compose up -d --build
```

### Environment Variables

```bash
# Core
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/yolandita
REDIS_URL=redis://localhost:6379/0
JWT_SECRET=your-super-secret-key-change-this

# API
API_PORT=8000
ENVIRONMENT=production
LOG_LEVEL=INFO

# Frontend
VITE_API_URL=https://api.yourdomain.com
NODE_ENV=production
```

### Production Checklist

- [ ] Update JWT secret in production
- [ ] Set `ENVIRONMENT=production`
- [ ] Enable HTTPS/SSL
- [ ] Configure production database
- [ ] Set up monitoring and logging
- [ ] Configure backups for database
- [ ] Set up CDN for static assets
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Set up CI/CD pipeline

---

## ✅ Testing

### Backend Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app tests/

# Run specific test file
pytest tests/test_integration.py -v

# Run specific test class
pytest tests/test_integration.py::TestHealthEndpoints -v

# Run with markers
pytest -m "not slow"
```

### Frontend Tests

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test Dashboard

# Watch mode
npm test -- --watch
```

### E2E Tests (Optional)

```bash
# Using Cypress
npm run cypress:open

# Using Playwright
npm run playwright:open
```

---

## 📁 Project Structure

```
yolandita/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI app entry
│   │   ├── config.py               # Settings & environment
│   │   ├── database/               # Database layer
│   │   │   ├── db.py               # Session & engine
│   │   │   ├── models.py           # SQLAlchemy models
│   │   │   └── migrations/         # Alembic migrations
│   │   ├── schemas/                # Pydantic models
│   │   │   ├── health.py
│   │   │   ├── incident.py
│   │   │   ├── video.py
│   │   │   └── analytics.py
│   │   ├── api/
│   │   │   └── routes/             # API endpoints
│   │   │       ├── health.py
│   │   │       ├── video.py
│   │   │       ├── incidents.py
│   │   │       └── analytics.py
│   │   ├── security.py             # JWT & auth
│   │   ├── exceptions.py           # Custom exceptions
│   │   ├── middleware.py           # CORS, logging, etc
│   │   └── utils/                  # Utilities
│   ├── tests/
│   │   ├── test_api.py
│   │   ├── test_integration.py
│   │   └── test_services.py
│   ├── requirements.txt
│   ├── requirements-dev.txt
│   ├── Dockerfile
│   └── .dockerignore
│
├── frontend/
│   ├── src/
│   │   ├── pages/                  # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── AnalyticsPage.jsx
│   │   │   ├── IncidentsPage.jsx
│   │   │   ├── CamerasPage.jsx
│   │   │   ├── SettingsPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── LoginPage.jsx
│   │   ├── components/             # Reusable components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── VideoFeed.jsx
│   │   │   ├── IncidentList.jsx
│   │   │   ├── ROICalculator.jsx
│   │   │   ├── HeatmapVisualization.jsx
│   │   │   ├── CameraGrid.jsx
│   │   │   ├── UserManagement.jsx
│   │   │   ├── SystemSettings.jsx
│   │   │   ├── NotificationCenter.jsx
│   │   │   └── AlertNotification.jsx
│   │   ├── layouts/                # Layout components
│   │   │   ├── MainLayout.jsx
│   │   │   └── AuthLayout.jsx
│   │   ├── store/                  # Zustand stores
│   │   │   ├── useAuthStore.js
│   │   │   ├── useIncidentStore.js
│   │   │   ├── useMetricsStore.js
│   │   │   ├── useAppStore.js
│   │   │   └── index.js
│   │   ├── services/
│   │   │   └── api.js              # Axios client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tests/
│   │   └── store.test.js
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── Dockerfile
│   └── .dockerignore
│
├── docker-compose.yml
├── .env.example
├── deploy.sh
├── README.md
└── LICENSE
```

---

## 🛠️ Technologies Used

### Backend
- **FastAPI** 0.104+ - Async web framework
- **SQLAlchemy** 2.0 - ORM  
- **PostgreSQL** 16 - Database
- **Alembic** - Migrations
- **Pydantic** 2.5 - Validation
- **PyJWT** - Authentication
- **Passlib** - Password hashing
- **Ultralytics** - YOLOv8 model
- **Pytest** - Testing

### Frontend
- **React** 18.2 - UI library
- **Vite** 5 - Build tool
- **React Router** 6 - Routing
- **Zustand** 4.4 - State management
- **Tailwind CSS** 3.3 - Styling
- **Recharts** 2.10 - Charts
- **Lucide React** 0.294 - Icons
- **Axios** 1.6 - HTTP client
- **Vitest** - Testing

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Orchestration
- **Alembic** - Database migrations
- **GitHub Actions** - CI/CD (optional)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For support, email support@yolandita.com or open an issue on GitHub.

---

## 🎉 Acknowledgments

- **YOLOv8** for object detection
- **FastAPI** community for excellent documentation
- **React** community for amazing tools
- All contributors and testers

---

**Made with ❤️ for safer retail spaces**

*Last Updated: February 22, 2024*
