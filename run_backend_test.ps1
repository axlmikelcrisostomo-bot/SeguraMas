# Script para ejecutar y probar el backend de Yolandita

Write-Host "`n=== Yolandita Backend Runner ===" -ForegroundColor Cyan
Write-Host "Iniciando servicios...`n" -ForegroundColor Yellow

# Cambiar al directorio del proyecto
$projectRoot = "Proyecto Yolandita"
cd $projectRoot

# Iniciar backend en una nueva ventana
Write-Host "1. Iniciando Backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend' ; Write-Host 'Backend Server Running on http://127.0.0.1:8000' -ForegroundColor Green ; python -m uvicorn app.main:app --reload"

# Esperar 5 segundos para que el backend inicie
Write-Host "   Esperando a que el backend inicie..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Ejecutar tests
Write-Host "`n2. Ejecutando Tests de API..." -ForegroundColor Green
python test_api.py

Write-Host "`n=== Proceso Completado ===" -ForegroundColor Cyan
Write-Host "Presiona cualquier tecla para salir..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
