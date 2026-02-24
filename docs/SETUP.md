# Setup & Installation Guide

## Prerequisites

- **Python 3.9+**
- **Node.js 18+ and npm**
- **PostgreSQL 13+**
- **Git**

---

## Backend Setup

### 1. Clone & Navigate
```bash
cd Proyecto\ Yolandita
cd backend
```

### 2. Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment
```bash
# Copy example config
cp .env.example .env

# Edit .env with your values
# IMPORTANT: Update DATABASE_URL with your PostgreSQL connection
```

**Example .env:**
```env
DATABASE_URL=postgresql://yolandita_user:password@localhost:5432/yolandita
API_TITLE=Yolandita API
DEBUG=True
SECRET_KEY=your-super-secret-key-here
```

### 5. Initialize Database
```bash
# Create database
createdb yolandita

# Run migrations (when using Alembic)
alembic upgrade head
```

### 6. Run Backend Server
```bash
# Development with auto-reload
python -m app.main

# Or with uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

Access API docs at: **http://localhost:8000/docs**

---

## Frontend Setup

### 1. Navigate to Frontend
```bash
cd ../frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Environment File
```bash
# Create .env.local
echo "VITE_API_URL=http://localhost:8000/api/v1" > .env.local
```

### 4. Run Development Server
```bash
npm run dev
```

**Expected Output:**
```
  VITE v5.0.0  ready in 150 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

Access dashboard at: **http://localhost:5173**

---

## Database Setup (PostgreSQL)

### Step 1: Create User & Database
```bash
# Login to PostgreSQL
psql -U postgres

# In psql prompt:
CREATE USER yolandita_user WITH PASSWORD 'secure_password';
CREATE DATABASE yolandita OWNER yolandita_user;
GRANT ALL PRIVILEGES ON DATABASE yolandita TO yolandita_user;
\q
```

### Step 2: Verify Connection
```bash
psql -U yolandita_user -h localhost -d yolandita
```

### Step 3: (Optional) Seed Test Data
```bash
python scripts/seed_data.py
```

---

## Docker Deployment (Optional)

### 1. Build Image
```bash
docker build -t yolandita-backend:latest .
```

### 2. Run Container
```bash
docker run -d \
  -e DATABASE_URL=postgresql://user:pass@host:5432/yolandita \
  -p 8000:8000 \
  yolandita-backend:latest
```

### 3. Docker Compose (Full Stack)
```bash
docker-compose up -d
```

---

## Testing

### Backend Tests
```bash
# Run all tests
pytest

# Verbose output
pytest -v

# With coverage
pytest --cov=app tests/
```

### Frontend Tests
```bash
npm run test
```

---

## Troubleshooting

### Database Connection Error
```
Error: could not connect to database
```
**Solution:** Check PostgreSQL is running and credentials are correct in `.env`

### Port Already in Use
```
Address already in use
```
**Solution:** Change port or kill process using it
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :8000
kill -9 <PID>
```

### YOLOv8 Download Fails
```
Error downloading model weights
```
**Solution:** Download manually
```bash
python -c "from ultralytics import YOLO; YOLO('yolov8m.pt')"
```

### Module Not Found
```
ModuleNotFoundError: No module named 'ultralytics'
```
**Solution:** Reinstall requirements
```bash
pip install --upgrade -r requirements.txt
```

---

## Development Workflow

### 1. Create Feature Branch
```bash
git checkout -b feature/new-feature
```

### 2. Make Changes
```bash
# Backend
backend/app/api/routes/new_endpoint.py

# Frontend
frontend/src/components/NewComponent.jsx
```

### 3. Run Tests
```bash
pytest backend/tests/
npm run test  # frontend
```

### 4. Commit & Push
```bash
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
```

---

## Production Deployment

### Backend (AWS EC2 Example)
```bash
# SSH into server
ssh -i key.pem ubuntu@your-server.com

# Clone repo
git clone repository-url
cd Proyecto\ Yolandita/backend

# Setup environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configure for production
# edit .env with production values

# Run with Gunicorn
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app.main:app

# Or use systemd service
sudo cp yolandita.service /etc/systemd/system/
sudo systemctl start yolandita
sudo systemctl enable yolandita
```

### Frontend (Netlify/Vercel)
```bash
# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

---

## Security Checklist

- [ ] Change default SECRET_KEY
- [ ] Use strong PostgreSQL password
- [ ] Enable CORS only for trusted origins
- [ ] Setup HTTPS/SSL certificate
- [ ] Configure firewall rules
- [ ] Regular security updates
- [ ] Implement rate limiting
- [ ] Setup logging & monitoring

---

## Support

For setup issues, check:
1. [Architecture Documentation](ARCHITECTURE.md)
2. [API Documentation](API.md)
3. GitHub Issues
4. Project Team
