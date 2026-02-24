#!/usr/bin/env python3
"""Initialize database with sample data"""
import asyncio
import os
from app.database.database import async_engine, AsyncSessionLocal
from app.database.models import Base, User, Store, Camera
from app.security import hash_password


async def init_db():
    """Initialize database and create sample data"""
    
    # Create all tables
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async with AsyncSessionLocal() as session:
        # Check if demo user already exists
        from sqlalchemy.future import select
        result = await session.execute(select(User).where(User.email == "demo@yolandita.com"))
        demo_user = result.scalars().first()
        
        if not demo_user:
            # Create demo store
            demo_store = Store(
                id="STORE-001",
                name="Demo Store",
                address="123 Main St",
                city="New York",
                country="USA"
            )
            session.add(demo_store)
            await session.flush()
            
            # Create demo user
            demo_user = User(
                email="demo@yolandita.com",
                password_hash=hash_password("demo1234"),
                name="Demo User",
                role="admin",
                store_id="STORE-001",
                active=True
            )
            session.add(demo_user)
            
            # Create demo cameras
            cameras = [
                Camera(
                    id="CAM-001",
                    store_id="STORE-001",
                    name="Main Entrance",
                    stream_url="http://example.com/cam1.mjpeg",
                    location="Entrance"
                ),
                Camera(
                    id="CAM-002",
                    store_id="STORE-001",
                    name="Back Area",
                    stream_url="http://example.com/cam2.mjpeg",
                    location="Back Area"
                ),
            ]
            session.add_all(cameras)
            
            await session.commit()
            print("✅ Database initialized with demo data")
            print("   Email: demo@yolandita.com")
            print("   Password: demo1234")
        else:
            print("✅ Database already initialized")


if __name__ == "__main__":
    asyncio.run(init_db())
