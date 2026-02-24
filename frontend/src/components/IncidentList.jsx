import React, { useState, useEffect } from 'react';
import { ChevronDown, Eye, CheckCircle, Trash2 } from 'lucide-react';
import { API_V1_URL } from '../config/api';

const IncidentList = ({
  onIncidentClick = () => {},
  onConfirm = () => {},
  onDelete = () => {},
}) => {
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('all'); // all, critical, high, medium, low
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await fetch(`${API_V1_URL}/incidents?limit=50`);
        const data = await response.json();
        setIncidents(data.incidents);
      } catch (error) {
        console.error('Error cargando incidentes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchIncidents, 30000);
    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'critical':
        return 'bg-red-600/30 border-red-500/50 text-red-300';
      case 'high':
        return 'bg-red-500/20 border-red-500/40 text-red-400';
      case 'medium':
        return 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400';
      case 'low':
        return 'bg-green-500/20 border-green-500/40 text-green-400';
      default:
        return 'bg-gray-500/20 border-gray-500/40 text-gray-400';
    }
  };

  const filteredIncidents = incidents.filter((incident) => {
    if (filter === 'all') return true;
    return incident.severity.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Registro de Incidentes</h2>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'Todos' },
            { value: 'critical', label: 'Crítico' },
            { value: 'high', label: 'Alto' },
            { value: 'medium', label: 'Medio' },
            { value: 'low', label: 'Bajo' }
          ].map((level) => (
            <button
              key={level.value}
              onClick={() => setFilter(level.value)}
              className={`px-3 py-1 rounded text-sm font-medium transition ${
                filter === level.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="text-center py-8 text-gray-400">
            <p>Cargando incidentes...</p>
          </div>
        ) : filteredIncidents.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No se encontraron incidentes</p>
          </div>
        ) : (
          filteredIncidents.map((incident) => (
            <div
              key={incident.id}
              className={`border ${getRiskColor(
                incident.severity
              )} rounded-lg p-4 cursor-pointer transition hover:opacity-80`}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between"
                onClick={() =>
                  setExpandedId(expandedId === incident.id ? null : incident.id)
                }
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-white">
                      {incident.type.replace(/_/g, ' ').toUpperCase()}
                    </h3>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded border ${getRiskColor(
                        incident.severity
                      )}`}
                    >
                      {incident.severity === 'critical' ? 'CRÍTICO' :
                       incident.severity === 'high' ? 'ALTO' :
                       incident.severity === 'medium' ? 'MEDIO' : 'BAJO'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {incident.zone} • {new Date(incident.timestamp).toLocaleString('es-ES')}
                  </p>
                </div>

                <ChevronDown
                  className={`w-5 h-5 transition ${
                    expandedId === incident.id ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {/* Expanded Details */}
              {expandedId === incident.id && (
                <div className="mt-4 pt-4 border-t border-gray-500/40">
                  {incident.description && (
                    <p className="text-sm text-gray-300 mb-4">
                      <span className="font-semibold">Descripción:</span>{' '}
                      {incident.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-400">Estado</p>
                      <p className="text-white font-medium capitalize">
                        {incident.status}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Confirmación</p>
                      <p className="text-white font-medium">
                        {incident.user_confirmed === null
                          ? '⏳ Pendiente'
                          : incident.user_confirmed
                          ? '✅ Confirmado'
                          : '❌ No Confirmado'}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => onIncidentClick(incident.id)}
                      className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Ver Detalles
                    </button>

                    {incident.user_confirmed === null && (
                      <button
                        onClick={() => onConfirm(incident.id, true)}
                        className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm font-medium transition flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Confirmar
                      </button>
                    )}

                    <button
                      onClick={() => onDelete(incident.id)}
                      className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 rounded text-sm font-medium transition border border-red-500/40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer Stats */}
      <div className="mt-6 pt-6 border-t border-gray-700 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-gray-400 text-sm">Total</p>
          <p className="text-2xl font-bold text-white">{incidents.length}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">No Confirmados</p>
          <p className="text-2xl font-bold text-yellow-400">
            {incidents.filter((i) => i.user_confirmed === null).length}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Alto Riesgo</p>
          <p className="text-2xl font-bold text-red-400">
            {incidents.filter((i) => i.risk_level === 'high').length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default IncidentList;
