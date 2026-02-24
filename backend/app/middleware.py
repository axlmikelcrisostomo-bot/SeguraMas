"""Middleware for logging, CORS, and request tracking"""
import time
import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
import uuid

logger = logging.getLogger(__name__)


class LoggingMiddleware(BaseHTTPMiddleware):
    """Middleware for request/response logging"""
    
    async def dispatch(self, request: Request, call_next) -> Response:
        """Log incoming request and outgoing response"""
        # Generate request ID
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id
        
        # Log incoming request
        logger.info(
            f"Incoming {request.method} {request.url.path}",
            extra={
                "request_id": request_id,
                "method": request.method,
                "path": request.url.path,
                "query": dict(request.query_params),
                "client": request.client.host if request.client else "unknown"
            }
        )
        
        # Track execution time
        start_time = time.time()
        
        try:
            response = await call_next(request)
            process_time = time.time() - start_time
            
            # Log successful response
            logger.info(
                f"Response {response.status_code} {request.method} {request.url.path}",
                extra={
                    "request_id": request_id,
                    "status_code": response.status_code,
                    "process_time": f"{process_time:.3f}s",
                    "method": request.method,
                    "path": request.url.path
                }
            )
            
            # Add custom headers
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Process-Time"] = str(process_time)
            
            return response
            
        except Exception as e:
            process_time = time.time() - start_time
            logger.error(
                f"Error processing request {request.method} {request.url.path}",
                extra={
                    "request_id": request_id,
                    "error": str(e),
                    "process_time": f"{process_time:.3f}s"
                },
                exc_info=True
            )
            raise


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Middleware for basic rate limiting (in-memory)"""
    
    def __init__(self, app, requests_per_minute: int = 1000):
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        self.requests = {}
    
    async def dispatch(self, request: Request, call_next) -> Response:
        """Check rate limit based on client IP"""
        client_ip = request.client.host if request.client else "unknown"
        current_time = time.time()
        
        # Clean old entries (older than 1 minute)
        self.requests = {
            ip: times for ip, times in self.requests.items()
            if times and current_time - times[-1] < 60
        }
        
        # Get request times for this IP
        if client_ip not in self.requests:
            self.requests[client_ip] = []
        
        request_times = self.requests[client_ip]
        
        # Remove old requests outside the 1-minute window
        request_times = [t for t in request_times if current_time - t < 60]
        
        # Check rate limit
        if len(request_times) >= self.requests_per_minute:
            logger.warning(
                f"Rate limit exceeded for {client_ip}",
                extra={"client_ip": client_ip, "requests": len(request_times)}
            )
            return Response(
                content='{"error": "Rate limit exceeded"}',
                status_code=429,
                media_type="application/json"
            )
        
        # Add current request timestamp
        request_times.append(current_time)
        self.requests[client_ip] = request_times
        
        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(self.requests_per_minute)
        response.headers["X-RateLimit-Remaining"] = str(
            self.requests_per_minute - len(request_times)
        )
        response.headers["X-RateLimit-Reset"] = str(
            int(current_time + 60)
        )
        
        return response


class RequestIDMiddleware(BaseHTTPMiddleware):
    """Middleware to add request ID to all requests"""
    
    async def dispatch(self, request: Request, call_next) -> Response:
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        request.state.request_id = request_id
        
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        
        return response
