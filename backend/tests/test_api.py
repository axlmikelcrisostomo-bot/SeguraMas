"""Tests for API endpoints"""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class TestHealthEndpoints:
    """Health check endpoint tests"""
    
    def test_health_check(self):
        """Test basic health check"""
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data
    
    def test_detailed_health(self):
        """Test detailed health check"""
        response = client.get("/api/v1/health/detailed")
        assert response.status_code == 200
        data = response.json()
        assert "api" in data
        assert "database" in data


class TestVideoEndpoints:
    """Video management endpoint tests"""
    
    def test_start_stream(self):
        """Test starting a video stream"""
        response = client.post("/api/v1/video/stream/start", json={
            "camera_id": "CAM-001",
            "stream_url": "rtsp://camera.local/stream"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["camera_id"] == "CAM-001"
        assert "timestamp" in data
    
    def test_stop_stream(self):
        """Test stopping a video stream"""
        response = client.post("/api/v1/video/stream/stop", json={
            "camera_id": "CAM-001"
        })
        assert response.status_code == 200
    
    def test_list_streams(self):
        """Test listing active streams"""
        response = client.get("/api/v1/video/streams")
        assert response.status_code == 200
        assert isinstance(response.json(), list)


class TestIncidentEndpoints:
    """Incident management endpoint tests"""
    
    def test_report_incident(self):
        """Test reporting an incident"""
        response = client.post("/api/v1/incidents/report", json={
            "camera_id": "CAM-001",
            "incident_type": "suspicious_behavior",
            "risk_level": "high",
            "description": "Person loitering"
        })
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert data["risk_level"] == "high"
        self.incident_id = data["id"]
    
    def test_get_incidents(self):
        """Test listing incidents"""
        response = client.get("/api/v1/incidents")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
    
    def test_get_incident_detail(self):
        """Test getting incident details"""
        # First create an incident
        create_resp = client.post("/api/v1/incidents/report", json={
            "camera_id": "CAM-001",
            "incident_type": "suspicious_behavior",
            "risk_level": "high"
        })
        incident_id = create_resp.json()["id"]
        
        # Get details
        response = client.get(f"/api/v1/incidents/{incident_id}")
        assert response.status_code == 200
        assert response.json()["id"] == incident_id


class TestAnalyticsEndpoints:
    """Analytics endpoint tests"""
    
    def test_get_roi(self):
        """Test ROI calculation endpoint"""
        response = client.get("/api/v1/analytics/roi?store_id=STORE-001&days=30")
        assert response.status_code == 200
        data = response.json()
        assert "roi_percentage" in data
        assert "savings_achieved" in data
    
    def test_get_heatmap(self):
        """Test heatmap endpoint"""
        response = client.get("/api/v1/analytics/heatmap?camera_id=CAM-001&days=7")
        assert response.status_code == 200
        data = response.json()
        assert "heatmap" in data
        assert "high_risk_zones" in data
    
    def test_get_metrics(self):
        """Test detection metrics endpoint"""
        response = client.get("/api/v1/analytics/detection-metrics?camera_id=CAM-001")
        assert response.status_code == 200
        data = response.json()
        assert "accuracy" in data
        assert "precision" in data
        assert "recall" in data


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
