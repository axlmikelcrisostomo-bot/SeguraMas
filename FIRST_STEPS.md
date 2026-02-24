# 🎯 First Steps - Copy & Paste Commands

Follow these exact commands in order. Copy and paste each block.

## Step 1: Navigate to Project
```bash
cd "C:\Users\USER\OneDrive\Desktop\Python\Proyecto Yolandita"
```

## Step 2: Validate Project (Optional but Recommended)
```bash
python validate.py
```

If you see all green checkmarks ✓, continue. Otherwise, check what's missing.

## Step 3: Setup Backend

### Option A: Windows PowerShell (Recommended for Windows)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\start.ps1
```

### Option B: Linux / Mac Terminal
```bash
chmod +x start.sh
./start.sh
```

### Option C: Manual Setup (All Platforms)

**Terminal 1 - Setup Backend:**
```bash
cd backend
python -m venv venv

# Activate virtual environment:
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# If using Windows Command Prompt: venv\Scripts\activate.bat

pip install --upgrade pip
pip install -r requirements.txt
python init_db.py
```

## Step 4: Setup Frontend

Open a **new terminal** in the project root.

```bash
cd frontend
npm install
```

Copy .env.development to .env:
```bash
# Mac/Linux:
cp .env.development .env

# Windows PowerShell:
Copy-Item .env.development .env

# Windows Command Prompt:
copy .env.development .env
```

## Step 5: Start Backend

In your first terminal (backend folder, venv activated):

```bash
uvicorn app.main:app --reload
```

**You should see:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

## Step 6: Start Frontend

Open a **third terminal**. From project root:

```bash
cd frontend
npm run dev
```

**You should see:**
```
  ➜  Local:   http://localhost:3000/
```

## Step 7: Open Application

Click or copy-paste into your browser:
```
http://localhost:3000
```

## Step 8: Login

Use these credentials:
- **Email**: demo@yolandita.com
- **Password**: demo1234

You should see the dashboard!

---

## Testing the API (Optional)

In a **fourth terminal**, from project root:

```bash
python test_api.py
```

Expected output:
```
✓ Health endpoint OK
✓ Login successful
✓ Incidents endpoint OK
✓ Analytics endpoint OK
```

---

## API Documentation

While backend is running, visit:
```
http://localhost:8000/docs
```

You'll see interactive API documentation.

---

## Stopping Services

To stop everything:

**Terminal 1 (Backend)**: Press `Ctrl+C`
**Terminal 2 (Frontend)**: Press `Ctrl+C`

---

## Common Issues

### "Port 8000 already in use" or "Port 3000 already in use"

**Windows:**
```powershell
# Find process on port 8000
netstat -ano | findstr :8000

# Kill it (replace PID with the number from output)
taskkill /PID <PID> /F

# Same for port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -ti:8000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### "ModuleNotFoundError" or "npm ERR!"

```bash
# Backend:
cd backend
pip install -r requirements.txt

# Frontend:
cd ../frontend
npm cache clean --force
npm install
```

### "Connection refused" when loading frontend

1. Make sure backend is running (see "Backend running on..." message)
2. Wait 5 seconds for backend to fully start
3. Refresh browser page

### "Invalid email or password" when logging in

1. Make sure database was initialized:
   ```bash
   cd backend
   python init_db.py
   ```
2. Check you're using correct credentials:
   - Email: demo@yolandita.com (NOT admin@)
   - Password: demo1234 (NOT password123)

---

## What You Should See

### Backend Terminal
```
INFO:     Uvicorn running on http://127.0.0.1:8000
...
INFO:     Application startup complete
```

### Frontend Terminal
```
  ➜  Local:   http://localhost:3000/
  ➜  Browser: http://localhost:3000/
```

### Browser at http://localhost:3000
- Login page with dark theme
- Demo credentials filled in
- Blue "Sign In" button
- After login: Dashboard with incidents count

### Browser at http://localhost:8000/docs
- Interactive API documentation
- List of all endpoints
- Try-it-out functionality

---

## Next: Explore Features

Try these after login:

1. **Dashboard** - See incident statistics
2. **Analytics** - View ROI and metrics
3. **Incidents** - Browse incident list
4. **Cameras** - View camera feeds
5. **Settings** - System configuration
6. **Profile** - User settings
7. **API Docs** - http://localhost:8000/docs

---

## References

- Full documentation: Open `README.md`
- Quick reference: Open `QUICK_START.md`
- Features list: Open `IMPLEMENTATION_CHECKLIST.md`
- Troubleshooting: Open `PRE_LAUNCH_CHECKLIST.md`

---

## Success!

If you can:
1. See the login page
2. Login successfully
3. View the dashboard
4. Access the API docs

**Congratulations! Yolandita is running! 🎉**

---

**Questions?**
- Check README.md
- Check api docs at http://localhost:8000/docs
- Check browser console (F12) for errors
- Check backend terminal for errors
