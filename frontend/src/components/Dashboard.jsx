import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { AlertCircle, Activity, TrendingUp, Camera } from 'lucide-react';
import { API_V1_URL } from '../config/api';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    status: 'operational',
    incidents_today: 0,
    active_cameras: 0,
    total_cameras: 0,
    total_detections_24h: 0,
  });

  const [chart_data, setChartData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Cargar datos de analíticas
        const analyticsResponse = await fetch(`${API_V1_URL}/analytics/dashboard`);
        const analyticsData = await analyticsResponse.json();

        // Cargar incidentes recientes
        const incidentsResponse = await fetch(`${API_V1_URL}/incidents?limit=5`);
        const incidentsData = await incidentsResponse.json();

        // Actualizar métricas
        setMetrics({
          status: 'operational',
          incidents_today: analyticsData.summary.total_incidents_24h,
          active_cameras: analyticsData.summary.active_cameras,
          total_cameras: analyticsData.summary.total_cameras,
          total_detections_24h: analyticsData.summary.total_detections_24h,
        });

        // Formatear datos del gráfico
        const formattedChartData = analyticsData.hourly_detections.slice(0, 7).map(item => ({
          hour: item.hour,
          incidents: item.incidents,
          detections: item.detections
        }));
        setChartData(formattedChartData);

        // Formatear alertas
        const formattedAlerts = incidentsData.incidents.slice(0, 5).map(incident => ({
          id: incident.id,
          type: incident.description.split('.')[0],
          zone: incident.zone,
          risk: incident.severity,
          time: new Date(incident.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        }));
        setAlerts(formattedAlerts);

      } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const getRiskBgColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return 'bg-red-500/20 border-red-500/40';
      case 'medium':
        return 'bg-yellow-500/20 border-yellow-500/40';
      case 'low':
        return 'bg-green-500/20 border-green-500/40';
      default:
        return 'bg-gray-500/20 border-gray-500/40';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Panel Yolandita</h1>
        <p className="text-gray-400">Monitoreo de Seguridad en Tiempo Real y Analíticas IA</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Status Card */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-green-500/50 transition animate-fadeIn" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm font-semibold">Estado</h3>
            <Activity className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-green-400 mb-1">Operacional</p>
          <p className="text-xs text-gray-500">Todos los sistemas funcionando</p>
        </div>

        {/* Incidents Card */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-yellow-500/50 transition animate-fadeIn" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm font-semibold">Incidentes de Hoy</h3>
            <AlertCircle className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-yellow-400 mb-1">{metrics.incidents_today}</p>
          <p className="text-xs text-gray-500">Últimas 24 horas</p>
        </div>

        {/* Active Streams */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500/50 transition animate-fadeIn" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm font-semibold">Cámaras Activas</h3>
            <Camera className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-blue-400 mb-1">{metrics.active_cameras}/{metrics.total_cameras}</p>
          <p className="text-xs text-gray-500">En línea</p>
        </div>

        {/* Detections Card */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-emerald-500/50 transition animate-fadeIn" style={{animationDelay: '0.4s'}}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm font-semibold">Detecciones 24h</h3>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-emerald-400 mb-1">{metrics.total_detections_24h.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Total de eventos</p>
        </div>
      </div>

      {/* Alertas Recientes - Horizontal Scroll */}
      <div className="mb-8 animate-fadeIn" style={{animationDelay: '0.5s'}}>
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-red-400" />
            Alertas Recientes
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-lg p-4 border min-w-[280px] flex-shrink-0 ${getRiskBgColor(alert.risk)}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <p className={`font-semibold text-sm ${getRiskColor(alert.risk)}`}>
                    {alert.type}
                  </p>
                  <span className="text-xs text-gray-400">{alert.time}</span>
                </div>
                <p className="text-sm text-gray-300 mb-2">{alert.zone}</p>
                <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${getRiskColor(alert.risk)}`}>
                  {alert.risk.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gráfico Principal - Ancho Completo */}
      <div className="mb-8 animate-slideIn" style={{animationDelay: '0.6s'}}>
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold mb-4">Incidentes y Detecciones (Últimas 24h)</h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chart_data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
              <XAxis dataKey="hour" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #404040',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                cursor={{ fill: 'transparent' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="incidents"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: '#f59e0b', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="detections"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk by Zone */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 animate-fadeIn">
        <h2 className="text-xl font-bold mb-4">Distribución de Riesgo por Zona</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={[
              { zone: 'Entrada', risk: 45 },
              { zone: 'Almacén', risk: 65 },
              { zone: 'Estacionamiento', risk: 80 },
              { zone: 'Caja', risk: 30 },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
            <XAxis dataKey="zone" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #404040',
                borderRadius: '8px',
                color: '#fff',
              }}
              cursor={{ fill: 'transparent' }}
            />
            <Bar dataKey="risk" fill="#ef4444" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
