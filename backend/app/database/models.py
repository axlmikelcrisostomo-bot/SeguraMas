"""SQLAlchemy ORM Models"""
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.orm import declarative_base
from datetime import datetime

Base = declarative_base()


class Incident(Base):
    """Incident database model"""
    __tablename__ = "incidents"
    
    id = Column(String, primary_key=True)
    camera_id = Column(String, nullable=False, index=True)
    incident_type = Column(String, nullable=False)
    risk_level = Column(String, nullable=False)  # low, medium, high
    description = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    status = Column(String, default="registered")
    user_confirmed = Column(Boolean, nullable=True)
    detection_data = Column(Text)  # JSON string


class Alert(Base):
    """Alert database model"""
    __tablename__ = "alerts"
    
    id = Column(String, primary_key=True)
    incident_id = Column(String, ForeignKey("incidents.id"))
    camera_id = Column(String, nullable=False, index=True)
    risk_level = Column(String, nullable=False)
    detection_summary = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    status = Column(String, default="active")
    notification_sent = Column(Boolean, default=False)


class Detection(Base):
    """Detection record database model"""
    __tablename__ = "detections"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    camera_id = Column(String, nullable=False, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    class_name = Column(String, nullable=False)
    confidence = Column(Float)
    box_coordinates = Column(Text)  # JSON string of [x1, y1, x2, y2]


class Store(Base):
    """Store/Business database model"""
    __tablename__ = "stores"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    address = Column(String)
    city = Column(String, index=True)
    country = Column(String)
    subscription_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Camera(Base):
    """Camera configuration database model"""
    __tablename__ = "cameras"
    
    id = Column(String, primary_key=True)
    store_id = Column(String, ForeignKey("stores.id"))
    name = Column(String, nullable=False)
    stream_url = Column(String)
    location = Column(String)  # Zone description
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class User(Base):
    """User account database model"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, default="user")  # user, admin
    store_id = Column(String, ForeignKey("stores.id"), nullable=True)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
