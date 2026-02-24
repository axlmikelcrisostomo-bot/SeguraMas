"""Video Stream Processing Service"""
import logging
import asyncio
from typing import Optional, Callable
from datetime import datetime

logger = logging.getLogger(__name__)


class VideoProcessor:
    """Handles video stream processing and frame extraction"""
    
    def __init__(self):
        """Initialize video processor"""
        self.active_streams = {}
        logger.info("VideoProcessor initialized")
    
    async def process_stream(
        self,
        camera_id: str,
        stream_url: str,
        frame_callback: Callable,
        interval_ms: int = 500
    ):
        """
        Process video stream frames
        
        Args:
            camera_id: Camera identifier
            stream_url: Video stream URL
            frame_callback: Async callback function for each frame
            interval_ms: Processing interval in milliseconds
        """
        try:
            import cv2
            
            cap = cv2.VideoCapture(stream_url)
            self.active_streams[camera_id] = {
                "started_at": datetime.utcnow(),
                "frame_count": 0,
                "active": True
            }
            
            logger.info(f"📹 Started processing stream: {camera_id}")
            
            while self.active_streams.get(camera_id, {}).get("active", False):
                ret, frame = cap.read()
                if not ret:
                    logger.warning(f"Failed to read frame from {camera_id}")
                    break
                
                # Process frame through callback
                await frame_callback(camera_id, frame)
                
                self.active_streams[camera_id]["frame_count"] += 1
                await asyncio.sleep(interval_ms / 1000)
            
            cap.release()
            logger.info(f"🛑 Stopped processing stream: {camera_id}")
            
        except Exception as e:
            logger.error(f"Error processing stream {camera_id}: {e}")
            if camera_id in self.active_streams:
                del self.active_streams[camera_id]
    
    def stop_stream(self, camera_id: str):
        """Stop processing a video stream"""
        if camera_id in self.active_streams:
            self.active_streams[camera_id]["active"] = False
            logger.info(f"Stopping stream: {camera_id}")
    
    def get_stream_stats(self, camera_id: str) -> Optional[dict]:
        """Get statistics for a video stream"""
        if camera_id not in self.active_streams:
            return None
        
        stream = self.active_streams[camera_id]
        return {
            "camera_id": camera_id,
            "started_at": stream["started_at"].isoformat(),
            "frame_count": stream["frame_count"],
            "active": stream["active"]
        }
