"""Incident Logging and Management Endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from datetime import datetime
from app.schemas import (
    IncidentCreate,
    IncidentResponse,
    IncidentListResponse,
    IncidentConfirm,
    RiskLevelEnum
)
from app.services.incident_logger import IncidentLogger
from app.exceptions import NotFoundError, ValidationError
from app.data import generate_incidents

router = APIRouter()
incident_logger = IncidentLogger()

# Generar incidentes sintéticos al iniciar
SYNTHETIC_INCIDENTS = generate_incidents(100)


@router.post("/incidents/report", response_model=IncidentResponse, status_code=status.HTTP_201_CREATED)
async def report_incident(incident: IncidentCreate):
    """Report a detected incident"""
    incident_id = incident_logger.log_incident(
        camera_id=incident.camera_id,
        incident_type=incident.incident_type.value,
        risk_level=incident.risk_level.value,
        description=incident.description
    )
    
    logged_incident = incident_logger.get_incident(incident_id)
    return IncidentResponse(
        id=logged_incident["id"],
        camera_id=logged_incident["camera_id"],
        incident_type=logged_incident["incident_type"],
        risk_level=logged_incident["risk_level"],
        description=logged_incident.get("description"),
        timestamp=datetime.fromisoformat(logged_incident["timestamp"]),
        status=logged_incident["status"],
        user_confirmed=logged_incident.get("user_confirmed")
    )


@router.get("/incidents")
async def list_incidents(
    camera_id: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0)
):
    """Get list of incidents with optional filters"""
    # Filtrar incidentes sintéticos
    filtered = SYNTHETIC_INCIDENTS
    
    if camera_id:
        filtered = [inc for inc in filtered if inc["camera_id"] == camera_id]
    
    if severity:
        filtered = [inc for inc in filtered if inc["severity"] == severity]
    
    if status:
        filtered = [inc for inc in filtered if inc["status"] == status]
    
    # Paginación
    total = len(filtered)
    paginated = filtered[offset:offset + limit]
    
    return {
        "incidents": paginated,
        "total": total,
        "limit": limit,
        "offset": offset
    }


@router.get("/incidents/{incident_id}")
async def get_incident(incident_id: str):
    """Get incident details"""
    incident = next((inc for inc in SYNTHETIC_INCIDENTS if inc["id"] == incident_id), None)
    if not incident:
        raise HTTPException(status_code=404, detail="Incidente no encontrado")
    
    return incident


@router.put("/incidents/{incident_id}/status")
async def update_incident_status(incident_id: str, status: str):
    """Update incident status"""
    incident = next((inc for inc in SYNTHETIC_INCIDENTS if inc["id"] == incident_id), None)
    if not incident:
        raise HTTPException(status_code=404, detail="Incidente no encontrado")
    
    incident["status"] = status
    if status == "resolved":
        incident["resolved_at"] = datetime.now().isoformat()
    
    return incident


@router.delete("/incidents/{incident_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_incident(incident_id: str):
    """Delete an incident record"""
    incident = incident_logger.get_incident(incident_id)
    if not incident:
        raise NotFoundError(f"Incident {incident_id} not found", "Incident")
    
    # In a real implementation, this would delete from database
    return None
