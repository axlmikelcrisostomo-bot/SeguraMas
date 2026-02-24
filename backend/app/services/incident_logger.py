"""Incident Logging Service"""
import logging
from datetime import datetime
from typing import Optional
import uuid

logger = logging.getLogger(__name__)


class IncidentLogger:
    """Handles incident recording and database operations"""
    
    def __init__(self):
        """Initialize incident logger"""
        self.incidents = {}  # Temporary in-memory storage
        logger.info("IncidentLogger initialized")
    
    def log_incident(
        self,
        camera_id: str,
        incident_type: str,
        risk_level: str,
        description: Optional[str] = None,
        detection_data: Optional[dict] = None
    ) -> str:
        """
        Log an incident to the database
        
        Args:
            camera_id: Source camera ID
            incident_type: Type of incident (suspicious_behavior, etc.)
            risk_level: Risk level (low, medium, high)
            description: Detailed description
            detection_data: Additional detection information
            
        Returns:
            Incident ID
        """
        incident_id = f"INC-{uuid.uuid4().hex[:8].upper()}"
        
        incident = {
            "id": incident_id,
            "camera_id": camera_id,
            "incident_type": incident_type,
            "risk_level": risk_level,
            "description": description,
            "detection_data": detection_data,
            "timestamp": datetime.utcnow().isoformat(),
            "status": "registered",
            "user_confirmed": None
        }
        
        self.incidents[incident_id] = incident
        logger.info(f"📋 Incident logged: {incident_id} ({risk_level} - {incident_type})")
        
        return incident_id
    
    def get_incident(self, incident_id: str) -> Optional[dict]:
        """Retrieve incident by ID"""
        return self.incidents.get(incident_id)
    
    def list_incidents(
        self,
        camera_id: Optional[str] = None,
        risk_level: Optional[str] = None,
        limit: int = 50
    ) -> list:
        """List incidents with optional filters"""
        incidents = list(self.incidents.values())
        
        if camera_id:
            incidents = [i for i in incidents if i["camera_id"] == camera_id]
        if risk_level:
            incidents = [i for i in incidents if i["risk_level"] == risk_level]
        
        return incidents[:limit]
    
    def confirm_incident(self, incident_id: str, confirmed: bool) -> Optional[dict]:
        """
        User confirms if incident was legitimate
        This data helps retrain the model
        """
        if incident_id not in self.incidents:
            return None
        
        self.incidents[incident_id]["user_confirmed"] = confirmed
        self.incidents[incident_id]["confirmation_timestamp"] = datetime.utcnow().isoformat()
        logger.info(f"✅ Incident {incident_id} confirmed: {confirmed}")
        
        return self.incidents[incident_id]
