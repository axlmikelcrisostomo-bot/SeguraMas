"""YOLOv8 Model Fine-tuning Script"""

from ultralytics import YOLO
from pathlib import Path


def finetune_yolov8(
    data_path: str,
    model_name: str = "yolov8m.pt",
    epochs: int = 100,
    batch_size: int = 16,
    imgsz: int = 640,
    patience: int = 20
):
    """
    Fine-tune YOLOv8 model on custom dataset
    
    Args:
        data_path: Path to dataset YAML file
        model_name: YOLOv8 model variant
        epochs: Training epochs
        batch_size: Batch size
        imgsz: Image size
        patience: Early stopping patience
        
    Example YAML structure:
        path: /path/to/dataset
        train: images/train
        val: images/val
        test: images/test
        
        nc: 3  # Number of classes
        names: ['suspicious_behavior', 'person', 'vehicle']
    """
    
    # Load model
    model = YOLO(model_name)
    
    # Train
    results = model.train(
        data=data_path,
        epochs=epochs,
        imgsz=imgsz,
        batch=batch_size,
        patience=patience,
        device=0,  # GPU device (0 for first GPU, -1 for CPU)
        project="runs/detect",
        name="custom_model",
        exist_ok=False,
        save=True,
        save_period=10,
        cache=True,
        half=True,  # Use half precision
        mosaic=1.0,  # Data augmentation
    )
    
    return results


def validate_model(model_path: str, data_path: str):
    """Validate trained model"""
    model = YOLO(model_path)
    metrics = model.val(data=data_path)
    return metrics


def test_model(model_path: str, image_path: str, conf_threshold: float = 0.5):
    """Test model on single image"""
    model = YOLO(model_path)
    results = model.predict(
        image_path,
        conf=conf_threshold,
        save=True,
        save_txt=True
    )
    return results


if __name__ == "__main__":
    # Example usage
    """
    # Prepare your dataset in COCO format or YOLO format
    # Then run:
    
    finetune_yolov8(
        data_path="path/to/data.yaml",
        model_name="yolov8m.pt",
        epochs=100,
        batch_size=16
    )
    """
    pass
