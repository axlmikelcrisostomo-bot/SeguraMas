import React, { useEffect } from 'react';
import { Dashboard, VideoFeed } from '../components';
import { useAppStore, useIncidentStore } from '../store';

const HomePage = () => {
  const { currentStore, fetchCameras } = useAppStore();
  const { fetchIncidents } = useIncidentStore();

  useEffect(() => {
    fetchCameras(currentStore);
    fetchIncidents();
  }, [currentStore, fetchCameras, fetchIncidents]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-white">Panel de </span>
          <span className="text-cyan-400">Seguridad</span>
        </h1>
        <p className="text-gray-400">Monitoreo en tiempo real y <span className="text-purple-400">detección de amenazas</span></p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dashboard KPIs - Left (2 cols) */}
        <div className="lg:col-span-2">
          <Dashboard />
        </div>

        {/* Video Feed - Right*/}
        <div className="lg:col-span-1">
          <VideoFeed />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide">ID de Tienda</p>
          <p className="text-2xl font-bold text-white mt-1">{currentStore}</p>
        </div>
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Estado del Sistema</p>
          <p className="text-2xl font-bold text-green-400 mt-1">●  Operacional</p>
        </div>
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Tiempo Activo</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">45 días</p>
        </div>
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Última Actualización</p>
          <p className="text-xl font-bold text-gray-300 mt-1">Ahora mismo</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
