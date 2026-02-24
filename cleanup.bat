@echo off
REM Script de limpieza de cache y reinstalación
REM Ejecutar como administrador

echo.
echo ========================================
echo LIMPIEZA Y ACTUALIZACIÓN DE YOLANDITA
echo ========================================
echo.

REM Limpiar Python cache
echo [1/6] Eliminando cache de Python...
powershell -Command "Get-ChildItem -Path . -Directory -Filter __pycache__ -Recurse | ForEach-Object { Remove-Item -Path $_.FullName -Recurse -Force -ErrorAction SilentlyContinue }"
powershell -Command "Get-ChildItem -Filter *.pyc -Recurse -Force | Remove-Item -Force -ErrorAction SilentlyContinue"
powershell -Command "Remove-Item -Path .pytest_cache -Recurse -Force -ErrorAction SilentlyContinue"
echo ✅ Cache de Python eliminado

REM Limpiar Node cache
echo.
echo [2/6] Eliminando cache de Node...
cd frontend
powershell -Command "Remove-Item -Path node_modules -Recurse -Force -ErrorAction SilentlyContinue"
powershell -Command "Remove-Item -Path .vite -Recurse -Force -ErrorAction SilentlyContinue"
powershell -Command "Remove-Item -Path dist -Recurse -Force -ErrorAction SilentlyContinue"
echo ✅ Cache de Node eliminado
cd ..

REM Limpiar uploads
echo.
echo [3/6] Eliminando archivos generados...
powershell -Command "Remove-Item -Path uploads -Recurse -Force -ErrorAction SilentlyContinue"
echo ✅ Archivos generados eliminados

REM Reinstalar dependencias
echo.
echo [4/6] Reinstalando dependencias del frontend...
cd frontend
call npm install --legacy-peer-deps
echo ✅ Frontend actualizado
cd ..

echo.
echo [5/6] Reinstalando dependencias del backend...
pip install -r backend/requirements.txt --quiet
echo ✅ Backend actualizado

echo.
echo [6/6] Creando directorios necesarios...
powershell -Command "New-Item -Path uploads/videos -ItemType Directory -Force -ErrorAction SilentlyContinue | Out-Null"
powershell -Command "New-Item -Path uploads/processed -ItemType Directory -Force -ErrorAction SilentlyContinue | Out-Null"
powershell -Command "New-Item -Path backend/uploads/videos -ItemType Directory -Force -ErrorAction SilentlyContinue | Out-Null"
powershell -Command "New-Item -Path backend/uploads/processed -ItemType Directory -Force -ErrorAction SilentlyContinue | Out-Null"
echo ✅ Directorios creados

echo.
echo ========================================
echo ✅ LIMPIEZA Y ACTUALIZACIÓN COMPLETADA
echo ========================================
echo.
echo Para iniciar la aplicación:
echo   1. Backend: python -m uvicorn app.main:app --reload (desde backend/)
echo   2. Frontend: npm run dev (desde frontend/)
echo.
pause
