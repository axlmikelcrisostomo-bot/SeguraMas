@echo off
cd backend
python -m venv venv
call venv\Scripts\activate.bat
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
python -W all -c "import app.main; import app.api.routes.auth; print('[OK] Backend imports successful')"
pause
