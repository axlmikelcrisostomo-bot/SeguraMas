"""YOLOv8 Model README"""

# YOLOv8 Models

This directory contains YOLOv8 model files for object detection.

## Available Models

- **yolov8n**: Nano - Fastest, smallest
- **yolov8s**: Small - Balance of speed and accuracy
- **yolov8m**: Medium - Default, good performance (RECOMMENDED)
- **yolov8l**: Large - High accuracy, slower
- **yolov8x**: Extra Large - Highest accuracy, slowest

## Download Models

The models are automatically downloaded on first use by Ultralytics.

To pre-download a specific model:

```python
from ultralytics import YOLO

# Download and load model
model = YOLO('yolov8m.pt')
```

## Model Inference

```python
from ultralytics import YOLO

model = YOLO('yolov8m.pt')
results = model('image.jpg')

for r in results:
    print(r.boxes)  # Bounding boxes
    print(r.names)  # Class names
    print(r.conf)   # Confidence scores
```

## Supported Classes

Standard COCO classes (80 total):

- **Common**: person, bicycle, car, motorbike, bus, truck, traffic light, fire hydrant, stop sign
- **Animals**: dog, cat, horse, cow, elephant, bear, zebra, giraffe
- **Vehicles**: car, motorbike, airplane, train, boat
- **Indoor**: bottle, wine glass, cup, fork, knife, spoon, bowl
- **Outdoor**: chair, couch, potted plant, bed, dining table
- **Sports**: tennis racket, baseball bat, skateboard, surfboard, frisbee

For Yolandita, we primarily use:
- **person** - Individual detection
- **car** - Vehicle detection
- **motorbike** - Motorcycle detection
- **bicycle** - Bicycle detection

## Fine-tuning for Your Location

To improve accuracy for your specific store:

1. Collect local images
2. Annotate with bounding boxes
3. Use training scripts in `training/` directory
4. Replace model weights

See `training/finetune.py` for custom training.

## Performance Metrics

Approximate metrics on COCO val2017:

| Model  | Size | mAP50 | Speed |
|--------|------|-------|-------|
| YOLOv8n | 640  | 37.3  | 0.7ms |
| YOLOv8s | 640  | 44.9  | 1.1ms |
| YOLOv8m | 640  | 50.2  | 1.7ms |
| YOLOv8l | 640  | 52.9  | 2.6ms |
| YOLOv8x | 640  | 53.9  | 3.8ms |

## References

- [YOLOv8 Documentation](https://docs.ultralytics.com/)
- [YOLOv8 GitHub](https://github.com/ultralytics/ultralytics)
