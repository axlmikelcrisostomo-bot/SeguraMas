"""User Management Endpoints"""
from fastapi import APIRouter, HTTPException, status
from typing import List
from app.data import USERS_DATA

router = APIRouter()


@router.get("/users")
async def get_users():
    """Obtener lista de todos los usuarios"""
    return {"users": USERS_DATA}


@router.get("/users/{user_id}")
async def get_user(user_id: str):
    """Obtener información de un usuario específico"""
    user = next((u for u in USERS_DATA if u["id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user


@router.put("/users/{user_id}")
async def update_user(user_id: str, user_data: dict):
    """Actualizar información de usuario"""
    user = next((u for u in USERS_DATA if u["id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Actualizar campos permitidos
    for key, value in user_data.items():
        if key in ["name", "email", "role", "active", "permissions"]:
            user[key] = value
    
    return user


@router.delete("/users/{user_id}")
async def delete_user(user_id: str):
    """Eliminar usuario"""
    user = next((u for u in USERS_DATA if u["id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    USERS_DATA.remove(user)
    return {"message": "Usuario eliminado correctamente"}
