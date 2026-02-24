#!/bin/bash

# Yolandita Deployment Script
# This script builds, tests, and deploys the full Yolandita stack

set -e

echo "🚀 Yolandita Deployment Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${YELLOW}📋 Checking prerequisites...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker and Docker Compose found${NC}"

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}📝 Creating .env file from .env.example${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ .env created (please review and update as needed)${NC}"
fi

# Build backend
echo -e "${YELLOW}🔨 Building backend...${NC}"
docker-compose build backend
echo -e "${GREEN}✅ Backend built${NC}"

# Build frontend
echo -e "${YELLOW}🔨 Building frontend...${NC}"
docker-compose build frontend
echo -e "${GREEN}✅ Frontend built${NC}"

# Start services
echo -e "${YELLOW}🚀 Starting services...${NC}"
docker-compose up -d
echo -e "${GREEN}✅ Services started${NC}"

# Wait for backend to be ready
echo -e "${YELLOW}⏳ Waiting for backend to be ready...${NC}"
for i in {1..30}; do
    if curl -f http://localhost:8000/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend is ready${NC}"
        break
    fi
    echo -n "."
    sleep 1
done

# Run migrations
echo -e "${YELLOW}📊 Running database migrations...${NC}"
docker-compose exec -T backend alembic upgrade head
echo -e "${GREEN}✅ Migrations complete${NC}"

# Show service status
echo -e "${YELLOW}📊 Service Status:${NC}"
docker-compose ps

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${YELLOW}📍 Services available at:${NC}"
echo -e "   Frontend:  http://localhost:3000"
echo -e "   Backend:   http://localhost:8000"
echo -e "   API Docs:  http://localhost:8000/docs"
echo -e "   Database:  localhost:5432"

echo ""
echo -e "${YELLOW}💡 Next steps:${NC}"
echo "   1. Visit http://localhost:3000 and login"
echo "   2. Check hardware with: docker-compose ps"
echo "   3. View logs with: docker-compose logs -f backend"
echo "   4. Stop services with: docker-compose down"

# Optional: Show logs
read -p "Do you want to view logs? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose logs -f
fi
