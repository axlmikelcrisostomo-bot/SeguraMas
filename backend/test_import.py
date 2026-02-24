#!/usr/bin/env python
"""Test script to verify video_upload module imports correctly"""
from pathlib import Path

print("=" * 60)
print("TESTING VIDEO_UPLOAD MODULE")
print("=" * 60)

try:
    from app.api.routes import video_upload
    print("✓ Módulo importado exitosamente")
    
    # Check if UPLOAD_DIR exists
    print(f"\n📁 UPLOAD_DIR: {video_upload.UPLOAD_DIR}")
    print(f"📁 ¿Existe? {video_upload.UPLOAD_DIR.exists()}")
    
    if video_upload.UPLOAD_DIR.exists():
        files = list(video_upload.UPLOAD_DIR.glob("*.mp4"))
        print(f"📹 Archivos encontrados: {len(files)}")
        for f in files[:5]:
            print(f"   - {f.name}")
    
    # Check if /stream endpoint exists
    routes = [r for r in dir(video_upload.router) if not r.startswith("_")]
    print(f"\n🔌 Router tiene {len(routes)} métodos")
    
    # Try to find the stream route
    print(f"\n🔍 Buscando endpoint /stream/...")
    for route in video_upload.router.routes:
        print(f"   Route: {route.path if hasattr(route, 'path') else 'N/A'}")
    
except Exception as e:
    print(f"✗ Error: {type(e).__name__}: {str(e)}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 60)
