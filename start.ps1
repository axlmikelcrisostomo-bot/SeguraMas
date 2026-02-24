# Quick Start Script for Yolandita Project (Windows PowerShell)

Write-Host "🚀 Yolandita - Quick Start" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Check prerequisites
Write-Host "`n📋 Checking prerequisites..." -ForegroundColor Yellow

try {
    python --version | Out-Null
} catch {
    Write-Host "❌ Python not found. Please install Python 3.10+" -ForegroundColor Red
    exit 1
}

try {
    npm --version | Out-Null
} catch {
    Write-Host "❌ npm not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

try {
    docker --version | Out-Null
} catch {
    Write-Host "❌ Docker not found. Please install Docker" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Prerequisites met" -ForegroundColor Green

# Backend Setup
Write-Host "`n🔧 Setting up Backend..." -ForegroundColor Yellow
cd backend

# Create virtual environment if not exists
if (-not (Test-Path "venv")) {
    python -m venv venv
    Write-Host "✅ Virtual environment created" -ForegroundColor Green
}

# Activate virtual environment
& ".\venv\Scripts\Activate.ps1"

# Install dependencies
python -m pip install --upgrade pip
pip install -r requirements.txt
Write-Host "✅ Backend dependencies installed" -ForegroundColor Green

# Frontend Setup
Write-Host "`n🎨 Setting up Frontend..." -ForegroundColor Yellow
cd ..\frontend

# Install dependencies
npm install
Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green

# Create .env if not exists
if (-not (Test-Path ".env")) {
    Copy-Item ".env.development" ".env"
    Write-Host "✅ Frontend environment configured" -ForegroundColor Green
}

# Root directory setup
cd ..

# Create .env if not exists
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Root environment configured" -ForegroundColor Green
}

# Database initialization
Write-Host "`n💾 Initializing Database..." -ForegroundColor Yellow
cd backend
python init_db.py
Write-Host "✅ Database initialized" -ForegroundColor Green

cd ..

Write-Host "`n✅ Setup complete!" -ForegroundColor Green
Write-Host "`n🎯 Next steps:" -ForegroundColor Cyan
Write-Host "1. Backend: cd backend && .\venv\Scripts\Activate.ps1 && uvicorn app.main:app --reload"
Write-Host "2. Frontend: cd frontend && npm run dev"
Write-Host "3. Open http://localhost:3000 in your browser"
Write-Host "`n📚 Demo credentials:" -ForegroundColor Cyan
Write-Host "   Email: demo@yolandita.com"
Write-Host "   Password: demo1234"
