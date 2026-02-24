"""Helper utility functions"""
from datetime import datetime, timedelta
from typing import Dict, List


def calculate_roi(
    gross_revenue: float,
    shadow_tax_percentage: float,
    subscription_cost: float,
    days: int = 30
) -> Dict:
    """
    Calculate ROI based on prevented losses
    
    Args:
        gross_revenue: Estimated gross revenue in period
        shadow_tax_percentage: Percentage of revenue lost to crime (default 10%)
        subscription_cost: Monthly subscription cost
        days: Period in days
        
    Returns:
        ROI metrics dictionary
    """
    projected_losses = gross_revenue * shadow_tax_percentage
    losses_prevented = projected_losses  # Assume system prevents all detected losses
    roi_percentage = ((losses_prevented - subscription_cost) / subscription_cost) * 100
    
    return {
        "gross_revenue": gross_revenue,
        "shadow_tax_percentage": shadow_tax_percentage,
        "projected_losses": projected_losses,
        "subscription_cost": subscription_cost,
        "losses_prevented": min(losses_prevented, projected_losses),
        "roi_percentage": roi_percentage,
        "net_savings": losses_prevented - subscription_cost,
        "period_days": days
    }


def get_time_range(days: int = 7) -> tuple:
    """Get start and end datetime for period"""
    end_time = datetime.utcnow()
    start_time = end_time - timedelta(days=days)
    return start_time, end_time


def convert_box_coords(box_array: List[float]) -> Dict:
    """Convert YOLO box coordinates to dictionary"""
    return {
        "x1": float(box_array[0]),
        "y1": float(box_array[1]),
        "x2": float(box_array[2]),
        "y2": float(box_array[3])
    }


def calculate_detection_metrics(
    total_detections: int,
    true_positives: int,
    false_positives: int,
    false_negatives: int
) -> Dict:
    """Calculate detection accuracy metrics"""
    
    # Accuracy = TP / (TP + FN)
    accuracy = true_positives / (true_positives + false_negatives) if (true_positives + false_negatives) > 0 else 0
    
    # Precision = TP / (TP + FP)
    precision = true_positives / (true_positives + false_positives) if (true_positives + false_positives) > 0 else 0
    
    # Recall = TP / (TP + FN)
    recall = true_positives / (true_positives + false_negatives) if (true_positives + false_negatives) > 0 else 0
    
    # F1 Score = 2 * (Precision * Recall) / (Precision + Recall)
    f1_score = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0
    
    return {
        "total_detections": total_detections,
        "true_positives": true_positives,
        "false_positives": false_positives,
        "false_negatives": false_negatives,
        "accuracy": round(accuracy, 3),
        "precision": round(precision, 3),
        "recall": round(recall, 3),
        "f1_score": round(f1_score, 3)
    }
