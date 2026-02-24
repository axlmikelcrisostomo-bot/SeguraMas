"""System Configuration Endpoints"""
from fastapi import APIRouter
from app.data import SYSTEM_CONFIG

router = APIRouter()


@router.get("/config")
async def get_config():
    """Obtener configuración completa del sistema"""
    return SYSTEM_CONFIG


@router.get("/config/{section}")
async def get_config_section(section: str):
    """Obtener sección específica de configuración"""
    if section not in SYSTEM_CONFIG:
        return {"error": "Sección no encontrada"}
    return {section: SYSTEM_CONFIG[section]}


@router.put("/config/{section}")
async def update_config_section(section: str, config_data: dict):
    """Actualizar sección de configuración"""
    if section not in SYSTEM_CONFIG:
        return {"error": "Sección no encontrada"}
    
    SYSTEM_CONFIG[section].update(config_data)
    return {section: SYSTEM_CONFIG[section]}


@router.put("/config")
async def update_config(config_data: dict):
    """Actualizar configuración completa"""
    for section, data in config_data.items():
        if section in SYSTEM_CONFIG:
            SYSTEM_CONFIG[section].update(data)
    return SYSTEM_CONFIG
