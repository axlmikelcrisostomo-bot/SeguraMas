import React, { useEffect } from 'react';
import { ROICalculator, HeatmapVisualization } from '../components';
import { useMetricsStore, useAppStore } from '../store';
import { TrendingUp, DollarSign, Map } from 'lucide-react';

const AnalyticsPage = () => {
  const { currentStore } = useAppStore();
  const { fetchAllMetrics, roiMetrics, detectionMetrics, loading } = useMetricsStore();

  useEffect(() => {
    fetchAllMetrics(currentStore);
  }, [currentStore, fetchAllMetrics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <TrendingUp className="w-12 h-12 text-blue-500 mx-auto" />
          </div>
          <p className="text-gray-400">Cargando analíticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Analíticas e Información</h1>
        <p className="text-gray-400">
          Cálculos de ROI, mapas de calor y métricas de rendimiento
        </p>
      </div>

      {/* ROI Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-6 h-6 text-green-500" />
          <h2 className="text-2xl font-bold text-white">Retorno de Inversión</h2>
        </div>
        <ROICalculator storeId={currentStore} />
      </div>

      {/* Heatmap Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Map className="w-6 h-6 text-orange-500" />
          <h2 className="text-2xl font-bold text-white">Store Heatmap & Zones</h2>
        </div>
        <HeatmapVisualization storeId={currentStore} />
      </div>
    </div>
  );
};

export default AnalyticsPage;
