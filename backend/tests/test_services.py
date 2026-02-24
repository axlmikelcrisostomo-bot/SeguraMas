"""Tests for business logic services"""
import pytest
from app.services.yolov8_detector import YOLOv8Detector
from app.services.incident_logger import IncidentLogger
from app.utils.helpers import calculate_roi, calculate_detection_metrics


class TestYOLOv8Detector:
    """YOLOv8 detector tests"""
    
    def test_detector_initialization(self):
        """Test detector initializes"""
        detector = YOLOv8Detector()
        assert detector is not None
    
    def test_risk_classification(self):
        """Test risk level classification"""
        detector = YOLOv8Detector()
        
        # High risk
        assert detector._classify_risk(0.85) == "high"
        
        # Medium risk
        assert detector._classify_risk(0.65) == "medium"
        
        # Low risk
        assert detector._classify_risk(0.30) == "low"


class TestIncidentLogger:
    """Incident logger tests"""
    
    def test_log_incident(self):
        """Test logging an incident"""
        logger = IncidentLogger()
        
        incident_id = logger.log_incident(
            camera_id="CAM-001",
            incident_type="suspicious_behavior",
            risk_level="high",
            description="Test incident"
        )
        
        assert incident_id is not None
        assert incident_id.startswith("INC-")
    
    def test_get_incident(self):
        """Test retrieving an incident"""
        logger = IncidentLogger()
        
        incident_id = logger.log_incident(
            camera_id="CAM-001",
            incident_type="suspicious_behavior",
            risk_level="high"
        )
        
        incident = logger.get_incident(incident_id)
        assert incident is not None
        assert incident["camera_id"] == "CAM-001"
    
    def test_confirm_incident(self):
        """Test confirming an incident"""
        logger = IncidentLogger()
        
        incident_id = logger.log_incident(
            camera_id="CAM-001",
            incident_type="suspicious_behavior",
            risk_level="high"
        )
        
        confirmed = logger.confirm_incident(incident_id, confirmed=True)
        assert confirmed["user_confirmed"] is True


class TestHelperFunctions:
    """Test utility helper functions"""
    
    def test_calculate_roi(self):
        """Test ROI calculation"""
        roi = calculate_roi(
            gross_revenue=100000,
            shadow_tax_percentage=0.10,
            subscription_cost=299,
            days=30
        )
        
        assert roi["gross_revenue"] == 100000
        assert roi["projected_losses"] == 10000
        assert roi["roi_percentage"] > 0
    
    def test_calculate_detection_metrics(self):
        """Test detection metrics calculation"""
        metrics = calculate_detection_metrics(
            total_detections=100,
            true_positives=85,
            false_positives=10,
            false_negatives=5
        )
        
        assert 0 <= metrics["accuracy"] <= 1
        assert 0 <= metrics["precision"] <= 1
        assert 0 <= metrics["recall"] <= 1
        assert 0 <= metrics["f1_score"] <= 1


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
