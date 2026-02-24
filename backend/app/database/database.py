"""Database Configuration and Session Management"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import NullPool
from typing import AsyncGenerator
from app.config import settings
import logging

logger = logging.getLogger(__name__)

# Base class for all models
Base = declarative_base()

# Create async engine
async_engine = create_async_engine(
    settings.database_url_async,
    echo=settings.database_echo,
    connect_args={"check_same_thread": False} if "sqlite" in settings.database_url_async else {}
)

# Async session factory (SQLAlchemy 1.4 compatible)
AsyncSessionLocal = sessionmaker(
    async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Database dependency for FastAPI routes
    
    Yields:
        AsyncSession: Database session
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception as e:
            await session.rollback()
            logger.error(f"Database session error: {e}")
            raise
        finally:
            await session.close()


# Aliases for backward compatibility with db.py imports
async def get_async_db() -> AsyncGenerator[AsyncSession, None]:
    """Alias for get_db() - backward compatibility"""
    async for session in get_db():
        yield session


async def init_async_db():
    """Alias for init_db() - backward compatibility"""
    await init_db()


async def close_async_db():
    """Alias for close_db() - backward compatibility"""
    await close_db()


async def init_db():
    """Initialize database tables"""
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables initialized")


async def close_db():
    """Close database connection"""
    await async_engine.dispose()
    logger.info("Database connection closed")
