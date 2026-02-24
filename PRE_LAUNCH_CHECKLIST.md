# ✅ Pre-Launch Checklist

Use this checklist before starting the application to ensure everything is set up correctly.

## System Requirements

- [ ] Python 3.10+ installed (`python --version`)
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Git installed (`git --version`)
- [ ] Minimum 2GB RAM available
- [ ] 500MB disk space available

## Backend Prerequisites

- [ ] PostgreSQL 14+ available (local or Docker)
- [ ] Python venv support available
- [ ] pip package manager working
- [ ] Port 8000 is available (for backend)

## Frontend Prerequisites

- [ ] Port 3000 is available (for development)
- [ ] Port 5173 available (Vite dev server alternative)
- [ ] npm cache is clear (optional: `npm cache clean --force`)

## Project Structure

- [ ] backend/ folder exists with:
  - [ ] app/ subdirectory
  - [ ] requirements.txt
  - [ ] init_db.py
  - [ ] alembic/ folder

- [ ] frontend/ folder exists with:
  - [ ] src/ subdirectory
  - [ ] package.json
  - [ ] vite.config.js
  - [ ] .env.development file

- [ ] Root directory contains:
  - [ ] docker-compose.yml
  - [ ] .env.example
  - [ ] start.sh or start.ps1
  - [ ] README.md

Run validation: `python validate.py`

## Environment Configuration

- [ ] .env file created from .env.example
- [ ] DATABASE_URL set correctly
- [ ] JWT_SECRET_KEY configured
- [ ] FRONTEND_URL matches http://localhost:3000

## Database Preparation

- [ ] PostgreSQL is running
- [ ] Can connect to PostgreSQL:
  ```bash
  psql -h localhost -U postgres -c "SELECT 1"
  ```
- [ ] Yolandita database will be created by migrations

## Port Availability Check

- [ ] Port 8000 is free (Backend API):
  ```bash
  # Mac/Linux
  lsof -ti:8000

  # Windows
  netstat -ano | findstr :8000
  ```

- [ ] Port 3000 is free (Frontend):
  ```bash
  # Mac/Linux
  lsof -ti:3000

  # Windows
  netstat -ano | findstr :3000
  ```

## Dependency Check

- [ ] No permission errors in project directory
- [ ] Can read all files:
  ```bash
  ls -la backend/ frontend/
  ```

## Quick Start Verification

Run these in order:

### Step 1: Validate Project
```bash
python validate.py
```
Expected: All green checkmarks ✓

### Step 2: Initialize Environment (Linux/Mac)
```bash
chmod +x start.sh
./start.sh
```

Or (Windows PowerShell):
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\start.ps1
```

### Step 3: Manual Setup (Alternative)
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python init_db.py

# Frontend
cd ../frontend
npm install
cp .env.development .env
```

### Step 4: Start Services

Terminal 1 - Backend:
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn app.main:app --reload
```
Wait for: "Uvicorn running on http://127.0.0.1:8000"

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```
Wait for: "Local: http://localhost:3000"

Terminal 3 - Test (Optional):
```bash
python test_api.py
```
Expected: All green checks ✓

### Step 5: Access Application

- [ ] Backend API: http://localhost:8000
- [ ] API Docs: http://localhost:8000/docs
- [ ] Frontend: http://localhost:3000
- [ ] Login with:
  - Email: demo@yolandita.com
  - Password: demo1234

## Common Issues

### Port Already in Use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### PostgreSQL Not Running
```bash
# Start PostgreSQL (Mac)
brew services start postgresql

# Start PostgreSQL (Linux)
sudo systemctl start postgresql

# Using Docker
docker run -d -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16
```

### Module Not Found Errors
```bash
# Reinstall backend deps
cd backend
pip install --upgrade pip
pip install -r requirements.txt

# Reinstall frontend deps
cd ../frontend
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Database Connection Issues
```bash
# Verify PostgreSQL connection
psql -h localhost -U postgres -c "SELECT 1"

# Reinitialize database
cd backend
python init_db.py
```

### Frontend Not Hot Reloading
```bash
# Clear vite cache
rm -rf frontend/.vite/

# Restart Vite server
npm run dev
```

## Production Preparation

Before deploying to production:

- [ ] Change JWT_SECRET_KEY to random value
- [ ] Set DEBUG=false
- [ ] Use production database URL
- [ ] Enable HTTPS
- [ ] Configure production CORS origins
- [ ] Set NODE_ENV=production
- [ ] Build frontend: `npm run build`
- [ ] Test with: `npm run preview`

## Final Security Check

- [ ] Demo credentials will be changed after first use
- [ ] Database password is strong
- [ ] JWT secret is randomly generated
- [ ] CORS is restrictive in production
- [ ] Error messages don't expose sensitive info
- [ ] Logging level appropriate for environment

## Documentation References

- **Full Setup**: README.md
- **Quick Start**: QUICK_START.md
- **Features**: IMPLEMENTATION_CHECKLIST.md
- **Project Status**: SESSION_SUMMARY.md
- **This Checklist**: PRE_LAUNCH_CHECKLIST.md (this file)

## Verification Commands

```bash
# Verify Python
python --version

# Verify npm
npm --version

# Verify project structure
python validate.py

# Test backend API health
python test_api.py

# Check port availability
# Mac/Linux: lsof -ti:8000 lsof -ti:3000
# Windows: netstat -ano | findstr :8000 :3000
```

## Success Indicators

✅ Python venv activated
✅ npm dependencies installed
✅ Database initialized with demo user
✅ Backend running on http://localhost:8000
✅ Frontend running on http://localhost:3000
✅ Can login with demo@yolandita.com / demo1234
✅ Dashboard displays without errors
✅ API documentation available at /docs

## Next Steps After Successful Launch

1. Explore the dashboard
2. Create test incidents
3. Review API documentation
4. Check database schema
5. Test all features
6. Review logs for errors
7. Performance test
8. Plan production deployment

---

**Status**: Ready to Launch! 🚀

If all checkboxes above are checked, your Yolandita installation is ready to go!

Start with:
```bash
./start.sh              # Mac/Linux
.\start.ps1             # Windows PowerShell
```

Or manually start both backend and frontend in separate terminals as described above.

Need help?
- Check README.md for detailed guide
- Run `python validate.py` to verify setup
- Run `python test_api.py` to test API
- Check browser console for frontend errors
- Check backend terminal for API errors
