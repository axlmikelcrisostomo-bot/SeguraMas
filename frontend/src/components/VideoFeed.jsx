import React, { useState } from 'react';

const CAMERA_VIDEOS = [
  { id: 'CAM-001', src: '/videos/stay_duration_analysis_web.mp4' },
  { id: 'CAM-002', src: '/videos/stay_duration_analysis2_web.mp4' },
  { id: 'CAM-003', src: '/videos/stay_duration_analysis3_web.mp4' },
  { id: 'CAM-004', src: '/videos/stay_duration_analysis4_web.mp4' },
];

const VideoFeed = ({ title = 'Transmisión en Vivo' }) => {
  const [selectedCameraIndex, setSelectedCameraIndex] = useState(0);
  const selectedCamera = CAMERA_VIDEOS[selectedCameraIndex];

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <div className="bg-black aspect-video">
        <video
          key={selectedCamera.id}
          src={selectedCamera.src}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          Tu navegador no soporta HTML5 video
        </video>
      </div>

      {/* Info Bar */}
      <div className="bg-gray-900 p-4 border-t border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="text-xs text-gray-400">ID de Cámara: {selectedCamera.id}</p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {CAMERA_VIDEOS.map((camera, index) => (
            <button
              key={camera.id}
              onClick={() => setSelectedCameraIndex(index)}
              className={`px-3 py-2 rounded text-sm font-semibold transition ${
                selectedCamera.id === camera.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {camera.id}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoFeed;
