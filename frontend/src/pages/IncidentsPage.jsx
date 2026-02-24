import React, { useEffect, useState } from 'react';
import { IncidentList, AlertNotification } from '../components';
import { AlertCircle } from 'lucide-react';
import { API_V1_URL } from '../config/api';

const IncidentsPage = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await fetch(`${API_V1_URL}/incidents?limit=100`);
        const data = await response.json();
        setIncidents(data.incidents);
      } catch (err) {
        console.error('Error cargando incidentes:', err);
        setError('Error al cargar incidentes');
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchIncidents, 30000);
    return () => clearInterval(interval);
  }, []);

  const criticalHighCount = incidents.filter(
    (i) => i.severity === 'critical' || i.severity === 'high'
  ).length;

  const unconfirmedCount = incidents.filter(
    (i) => i.status === 'active' || i.status === 'investigating'
  ).length;

  const resolvedCount = incidents.filter(
    (i) => i.status === 'resolved'
  ).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Gestión de Incidentes</h1>
        <p className="text-gray-400">Visualiza, analiza y responde a incidentes detectados</p>
      </div>

      {/* Alert Banner */}
      {criticalHighCount > 0 && (
        <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-400" />
            <div>
              <p className="font-semibold text-red-300">
                {criticalHighCount} Incidente{criticalHighCount !== 1 ? 's' : ''} Crítico{criticalHighCount !== 1 ? 's' : ''}/Alto Riesgo
              </p>
              <p className="text-xs text-red-400">Requiere atención inmediata</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          <p className="text-sm text-gray-400 mb-1">Total de Incidentes</p>
          <p className="text-3xl font-bold text-white">{incidents.length}</p>
        </div>
        <div className="bg-red-900/30 rounded-lg border border-red-700/50 p-4">
          <p className="text-sm text-red-300 mb-1">Crítico/Alto</p>
          <p className="text-3xl font-bold text-red-300">{criticalHighCount}</p>
        </div>
        <div className="bg-yellow-900/30 rounded-lg border border-yellow-700/50 p-4">
          <p className="text-sm text-yellow-300 mb-1">Pendientes</p>
          <p className="text-3xl font-bold text-yellow-300">
            {unconfirmedCount}
          </p>
        </div>
        <div className="bg-green-900/30 rounded-lg border border-green-700/50 p-4">
          <p className="text-sm text-green-300 mb-1">Resueltos</p>
          <p className="text-3xl font-bold text-green-300">
            {resolvedCount}
          </p>
        </div>
      </div>

      {/* Incidents List */}
      <div>
        {loading ? (
          <div className="text-center py-12 text-gray-400">
            <p>Cargando incidentes...</p>
          </div>
        ) : (
          <IncidentList />
        )}
      </div>
    </div>
  );
};

export default IncidentsPage;
