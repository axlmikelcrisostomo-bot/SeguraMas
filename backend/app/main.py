"""FastAPI Application Entry Point"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.config import settings
from app.api.routes import health, video, incidents, analytics, auth, users, config, video_upload
from app.exceptions import setup_exception_handlers
from app.middleware import LoggingMiddleware, RateLimitMiddleware, RequestIDMiddleware


# Configure Logging
logging.basicConfig(level=settings.log_level)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("🚀 Yolandita Backend Starting...")
    logger.info(f"Debug Mode: {settings.debug}")
    
    yield
    
    # Shutdown
    logger.info("🛑 Yolandita Backend Shutting Down...")


# Create FastAPI App
app = FastAPI(
    title=settings.api_title,
    version=settings.api_version,
    description="Real-time Security Monitoring with YOLOv8",
    lifespan=lifespan
)

# Add Exception Handlers
setup_exception_handlers(app)

# Add Middleware (order matters - these wrap the app)
app.add_middleware(RateLimitMiddleware, requests_per_minute=1000)
app.add_middleware(LoggingMiddleware)
app.add_middleware(RequestIDMiddleware)

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api/v1", tags=["Authentication"])
app.include_router(health.router, prefix="/api/v1", tags=["Health"])
app.include_router(video.router, prefix="/api/v1", tags=["Video"])
app.include_router(video_upload.router, prefix="/api/v1/video", tags=["Video Upload"])
app.include_router(incidents.router, prefix="/api/v1", tags=["Incidents"])
app.include_router(analytics.router, prefix="/api/v1", tags=["Analytics"])
app.include_router(users.router, prefix="/api/v1", tags=["Users"])
app.include_router(config.router, prefix="/api/v1", tags=["Configuration"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Yolandita API",
        "status": "operational",
        "version": settings.api_version
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug
    )
