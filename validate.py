#!/usr/bin/env python3
"""Project Structure Validator - Verifies all components are in place"""

import os
import json
import sys
from pathlib import Path

# Colors for output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'

def check_file_exists(path, name):
    """Check if file exists"""
    if os.path.exists(path):
        print(f"  {Colors.GREEN}✓{Colors.RESET} {name}")
        return True
    else:
        print(f"  {Colors.RED}✗{Colors.RESET} {name} - NOT FOUND")
        return False

def check_directory_exists(path, name):
    """Check if directory exists"""
    if os.path.isdir(path):
        print(f"  {Colors.GREEN}✓{Colors.RESET} {name}")
        return True
    else:
        print(f"  {Colors.RED}✗{Colors.RESET} {name} - NOT FOUND")
        return False

def validate_project():
    """Validate project structure"""
    print(f"\n{Colors.BLUE}🔍 Yolandita Project Validator{Colors.RESET}")
    print("=" * 50)
    
    base_path = Path(".")
    all_valid = True
    
    # Check Backend Structure
    print(f"\n{Colors.YELLOW}Backend Structure:{Colors.RESET}")
    backend_structure = [
        ("backend/app/main.py", "Main app file"),
        ("backend/app/config.py", "Configuration"),
        ("backend/app/security.py", "Security module"),
        ("backend/app/middleware.py", "Middleware"),
        ("backend/app/exceptions.py", "Exception handlers"),
        ("backend/app/database/models.py", "Database models"),
        ("backend/app/database/database.py", "Database config"),
        ("backend/app/api/routes/health.py", "Health routes"),
        ("backend/app/api/routes/auth.py", "Auth routes"),
        ("backend/app/api/routes/incidents.py", "Incident routes"),
        ("backend/app/api/routes/analytics.py", "Analytics routes"),
        ("backend/app/api/routes/video.py", "Video routes"),
        ("backend/app/schemas/health.py", "Health schemas"),
        ("backend/init_db.py", "Database init script"),
        ("backend/requirements.txt", "Python dependencies"),
        ("backend/alembic/env.py", "Alembic configuration"),
    ]
    
    for path, name in backend_structure:
        if not check_file_exists(path, name):
            all_valid = False
    
    # Check Frontend Structure
    print(f"\n{Colors.YELLOW}Frontend Structure:{Colors.RESET}")
    frontend_structure = [
        ("frontend/src/App.jsx", "App component"),
        ("frontend/src/main.jsx", "Entry point"),
        ("frontend/src/store/useAuthStore.js", "Auth store"),
        ("frontend/src/store/useIncidentStore.js", "Incident store"),
        ("frontend/src/store/useMetricsStore.js", "Metrics store"),
        ("frontend/src/store/useAppStore.js", "App store"),
        ("frontend/src/pages/LoginPage.jsx", "Login page"),
        ("frontend/src/pages/HomePage.jsx", "Home page"),
        ("frontend/src/pages/AnalyticsPage.jsx", "Analytics page"),
        ("frontend/src/pages/IncidentsPage.jsx", "Incidents page"),
        ("frontend/src/layouts/MainLayout.jsx", "Main layout"),
        ("frontend/src/layouts/AuthLayout.jsx", "Auth layout"),
        ("frontend/package.json", "npm dependencies"),
        ("frontend/vite.config.js", "Vite config"),
        ("frontend/.env.development", "Dev environment"),
    ]
    
    for path, name in frontend_structure:
        if not check_file_exists(path, name):
            all_valid = False
    
    # Check Root Configuration
    print(f"\n{Colors.YELLOW}Root Configuration:{Colors.RESET}")
    root_config = [
        ("docker-compose.yml", "Docker Compose"),
        (".env.example", "Environment example"),
        (".gitignore", "Git ignore rules"),
        ("README.md", "Documentation"),
        ("QUICK_START.md", "Quick start guide"),
    ]
    
    for path, name in root_config:
        if not check_file_exists(path, name):
            all_valid = False
    
    # Check Directories
    print(f"\n{Colors.YELLOW}Directory Structure:{Colors.RESET}")
    directories = [
        ("backend/app/database", "Backend database"),
        ("backend/app/api/routes", "Backend routes"),
        ("backend/app/schemas", "Backend schemas"),
        ("backend/tests", "Backend tests"),
        ("frontend/src/pages", "Frontend pages"),
        ("frontend/src/store", "Frontend stores"),
        ("frontend/src/components", "Frontend components"),
        ("frontend/src/layouts", "Frontend layouts"),
    ]
    
    for path, name in directories:
        if not check_directory_exists(path, name):
            all_valid = False
    
    # Summary
    print("\n" + "=" * 50)
    if all_valid:
        print(f"{Colors.GREEN}✓ All components are in place!{Colors.RESET}")
        print(f"\n{Colors.BLUE}Next steps:{Colors.RESET}")
        print("1. Windows PowerShell: .\\start.ps1")
        print("2. macOS/Linux: ./start.sh")
        print("3. Manual: See README.md or QUICK_START.md")
        return 0
    else:
        print(f"{Colors.RED}✗ Some components are missing!{Colors.RESET}")
        print(f"\n{Colors.YELLOW}Please check the paths above.{Colors.RESET}")
        return 1

if __name__ == "__main__":
    sys.exit(validate_project())
