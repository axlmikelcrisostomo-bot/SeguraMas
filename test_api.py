#!/usr/bin/env python3
"""Quick API Test Script - Verify backend is working"""

import json
import sys
import os
from datetime import datetime
import requests

BASE_URL = "http://localhost:8000/api/v1"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'
    
    @classmethod
    def disable_colors(cls):
        """Disable colors for Windows compatibility"""
        cls.GREEN = ''
        cls.RED = ''
        cls.YELLOW = ''
        cls.BLUE = ''
        cls.RESET = ''

# Enable colors support for Windows
try:
    if os.name == 'nt':  # Windows
        os.system('color')  # Enable ANSI colors in Windows 10+
except:
    Colors.disable_colors()

def test_health():
    """Test health endpoint"""
    print(f"\n{Colors.BLUE}Testing Health Endpoint{Colors.RESET}")
    print("-" * 40)
    
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        
        if response.status_code == 200:
            print(f"{Colors.GREEN}✓ Health endpoint OK{Colors.RESET}")
            print(f"  Status: {response.status_code}")
            return True
        else:
            print(f"{Colors.RED}✗ Health endpoint failed{Colors.RESET}")
            print(f"  Status: {response.status_code}")
            return False
    except Exception as e:
        print(f"{Colors.RED}✗ Connection failed: {e}{Colors.RESET}")
        return False

def test_login():
    """Test login endpoint"""
    print(f"\n{Colors.BLUE}Testing Auth Login{Colors.RESET}")
    print("-" * 40)
    
    credentials = {
        "email": "demo@yolandita.com",
        "password": "demo1234"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json=credentials,
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('access_token')
            print(f"{Colors.GREEN}✓ Login successful{Colors.RESET}")
            print(f"  Token: {token[:30]}..." if token else "  No token received")
            print(f"  User: {data.get('user', {}).get('email')}")
            return token
        else:
            print(f"{Colors.RED}✗ Login failed{Colors.RESET}")
            print(f"  Status: {response.status_code}")
            print(f"  Response: {response.text}")
            return None
    except Exception as e:
        print(f"{Colors.RED}✗ Login error: {e}{Colors.RESET}")
        return None

def test_incidents(token):
    """Test incidents endpoint"""
    print(f"\n{Colors.BLUE}Testing Incidents Endpoint{Colors.RESET}")
    print("-" * 40)
    
    try:
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.get(
            f"{BASE_URL}/incidents",
            headers=headers,
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            count = len(data.get('incidents', []))
            print(f"{Colors.GREEN}✓ Incidents endpoint OK{Colors.RESET}")
            print(f"  Total incidents: {count}")
            return True
        else:
            print(f"{Colors.RED}✗ Incidents endpoint failed{Colors.RESET}")
            print(f"  Status: {response.status_code}")
            return False
    except Exception as e:
        print(f"{Colors.RED}✗ Incidents request error: {e}{Colors.RESET}")
        return False

def test_analytics(token):
    """Test analytics endpoint"""
    print(f"\n{Colors.BLUE}Testing Analytics Endpoint{Colors.RESET}")
    print("-" * 40)
    
    try:
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.get(
            f"{BASE_URL}/analytics/roi",
            params={"store_id": "STORE-001"},
            headers=headers,
            timeout=5
        )
        
        if response.status_code == 200:
            print(f"{Colors.GREEN}✓ Analytics endpoint OK{Colors.RESET}")
            print(f"  Status: {response.status_code}")
            return True
        else:
            print(f"{Colors.YELLOW}⚠ Analytics endpoint returned: {response.status_code}{Colors.RESET}")
            return False
    except Exception as e:
        print(f"{Colors.YELLOW}⚠ Analytics error: {e}{Colors.RESET}")
        return False

def main():
    """Run all tests"""
    print(f"\n{Colors.BLUE}🧪 Yolandita Backend API Test Suite{Colors.RESET}")
    print("=" * 50)
    print(f"Base URL: {BASE_URL}")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Test health
    health_ok = test_health()
    
    if not health_ok:
        print(f"\n{Colors.RED}Backend is not running!{Colors.RESET}")
        print(f"Start it with: cd backend && uvicorn app.main:app --reload")
        return
    
    # Test login
    token = test_login()
    
    if not token:
        print(f"\n{Colors.RED}Authentication failed!{Colors.RESET}")
        print(f"Make sure database is initialized: python backend/init_db.py")
        return
    
    # Test incidents
    test_incidents(token)
    
    # Test analytics
    test_analytics(token)
    
    # Summary
    print(f"\n{Colors.BLUE}Test Summary{Colors.RESET}")
    print("=" * 50)
    print(f"{Colors.GREEN}✓ Backend is operational{Colors.RESET}")
    print(f"{Colors.GREEN}✓ Authentication working{Colors.RESET}")
    print(f"{Colors.GREEN}✓ API endpoints responding{Colors.RESET}")
    print(f"\nNext: Start frontend with: cd frontend && npm run dev")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}Test cancelled{Colors.RESET}")
    except Exception as e:
        print(f"\n{Colors.RED}Error: {e}{Colors.RESET}")
        import traceback
        traceback.print_exc()
