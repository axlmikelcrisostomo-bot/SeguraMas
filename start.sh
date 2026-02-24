#!/bin/bash
# Quick Start Script for Yolandita Project

set -e

echo "🚀 Yolandita - Quick Start"
echo "================================"

# Check prerequisites
echo "\n📋 Checking prerequisites..."

if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.10+"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install Node.js 18+"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker"
    exit 1
fi

echo "✅ Prerequisites met"

# Backend Setup
echo "\n🔧 Setting up Backend..."
cd backend

# Create virtual environment if not exists
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✅ Virtual environment created"
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
echo "✅ Backend dependencies installed"

# Frontend Setup
echo "\n🎨 Setting up Frontend..."
cd ../frontend

# Install dependencies
npm install
echo "✅ Frontend dependencies installed"

# Create .env if not exists
if [ ! -f ".env" ]; then
    cp .env.development .env
    echo "✅ Frontend environment configured"
fi

# Root directory setup
cd ..

# Create .env if not exists
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ Root environment configured"
fi

# Database initialization
echo "\n💾 Initializing Database..."
cd backend
python init_db.py
echo "✅ Database initialized"

cd ..

echo "\n✅ Setup complete!"
echo "\n🎯 Next steps:"
echo "1. Backend: cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
echo "2. Frontend: cd frontend && npm run dev"
echo "3. Open http://localhost:3000 in your browser"
echo "\n📚 Demo credentials:"
echo "   Email: demo@yolandita.com"
echo "   Password: demo1234"
