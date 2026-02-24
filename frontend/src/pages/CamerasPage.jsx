import React from 'react';
import { CameraGrid } from '../components';

const CamerasPage = () => {

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Gestión de Cámaras</h1>
        <p className="text-gray-400">Monitorea transmisiones en vivo y administra la configuración de cámaras</p>
      </div>

      {/* Camera Grid */}
      <div className="animate-fadeIn" style={{animationDelay: '0.4s'}}>
        <CameraGrid />
      </div>
    </div>
  );
};

export default CamerasPage;
