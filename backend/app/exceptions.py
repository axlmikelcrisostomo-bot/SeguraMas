"""Exception handlers and custom exceptions"""
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class YolanditaException(Exception):
    """Base exception for Yolandita application"""
    
    def __init__(
        self,
        message: str,
        code: str = "INTERNAL_ERROR",
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        details: dict = None
    ):
        self.message = message
        self.code = code
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)


class ValidationError(YolanditaException):
    """Validation error exception"""
    
    def __init__(self, message: str, details: dict = None):
        super().__init__(
            message=message,
            code="VALIDATION_ERROR",
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            details=details
        )


class NotFoundError(YolanditaException):
    """Resource not found exception"""
    
    def __init__(self, message: str, resource: str = "Resource"):
        super().__init__(
            message=message,
            code="NOT_FOUND",
            status_code=status.HTTP_404_NOT_FOUND,
            details={"resource": resource}
        )


class UnauthorizedError(YolanditaException):
    """Unauthorized access exception"""
    
    def __init__(self, message: str = "Unauthorized"):
        super().__init__(
            message=message,
            code="UNAUTHORIZED",
            status_code=status.HTTP_401_UNAUTHORIZED
        )


class ForbiddenError(YolanditaException):
    """Forbidden access exception"""
    
    def __init__(self, message: str = "Forbidden"):
        super().__init__(
            message=message,
            code="FORBIDDEN",
            status_code=status.HTTP_403_FORBIDDEN
        )


class ConflictError(YolanditaException):
    """Resource conflict exception"""
    
    def __init__(self, message: str, details: dict = None):
        super().__init__(
            message=message,
            code="CONFLICT",
            status_code=status.HTTP_409_CONFLICT,
            details=details
        )


class RateLimitError(YolanditaException):
    """Rate limit exceeded exception"""
    
    def __init__(self, message: str = "Rate limit exceeded"):
        super().__init__(
            message=message,
            code="RATE_LIMIT_EXCEEDED",
            status_code=status.HTTP_429_TOO_MANY_REQUESTS
        )


class DatabaseError(YolanditaException):
    """Database operation exception"""
    
    def __init__(self, message: str = "Database error"):
        super().__init__(
            message=message,
            code="DATABASE_ERROR",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class ExternalServiceError(YolanditaException):
    """External service exception"""
    
    def __init__(self, message: str, service: str = "Unknown"):
        super().__init__(
            message=message,
            code="EXTERNAL_SERVICE_ERROR",
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            details={"service": service}
        )


# Exception handlers

async def yolandita_exception_handler(request: Request, exc: YolanditaException):
    """Handle YolanditaException"""
    logger.error(
        f"Application error: {exc.code} - {exc.message}",
        extra={"path": request.url.path, "details": exc.details}
    )
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.message,
            "code": exc.code,
            "details": exc.details if exc.details else None,
            "timestamp": datetime.utcnow().isoformat(),
            "path": str(request.url.path)
        }
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle Pydantic validation errors"""
    errors = {}
    for error in exc.errors():
        field = ".".join(str(x) for x in error["loc"][1:])
        errors[field] = error["msg"]
    
    logger.warning(
        f"Validation error on {request.url.path}",
        extra={"errors": errors}
    )
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "Validation error",
            "code": "VALIDATION_ERROR",
            "details": errors,
            "timestamp": datetime.utcnow().isoformat(),
            "path": str(request.url.path)
        }
    )


async def generic_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions"""
    logger.exception(
        f"Unexpected error on {request.url.path}",
        extra={"error": str(exc)}
    )
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal server error",
            "code": "INTERNAL_ERROR",
            "timestamp": datetime.utcnow().isoformat(),
            "path": str(request.url.path)
        }
    )


def setup_exception_handlers(app: FastAPI):
    """Register exception handlers with FastAPI app"""
    app.add_exception_handler(YolanditaException, yolandita_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, generic_exception_handler)
