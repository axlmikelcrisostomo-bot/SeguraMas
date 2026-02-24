"""
DEPRECATED: This module is no longer maintained.
Use app.database.database instead for all database operations.

Kept for backward compatibility only.
"""
# All imports and exports redirected to database.py
from app.database.database import (
    AsyncSessionLocal,
    async_engine,
    get_db,
    get_async_db,
    init_async_db,
    close_async_db,
)

__all__ = [
    "AsyncSessionLocal",
    "async_engine",
    "get_db",
    "get_async_db",
    "init_async_db",
    "close_async_db",
]
