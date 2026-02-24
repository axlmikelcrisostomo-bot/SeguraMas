import React from 'react';

const VIDEOS = [
  '/videos/stay_duration_analysis_web.mp4',
  '/videos/stay_duration_analysis2_web.mp4',
  '/videos/stay_duration_analysis3_web.mp4',
  '/videos/stay_duration_analysis4_web.mp4',
];

const CameraGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {VIDEOS.map((videoSrc) => (
        <div key={videoSrc} className="aspect-video bg-black rounded-lg overflow-hidden border border-gray-700">
          <video
            src={videoSrc}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            Tu navegador no soporta HTML5 video
          </video>
        </div>
      ))}
    </div>
  );
};

export default CameraGrid;
