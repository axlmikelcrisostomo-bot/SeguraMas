import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertCircle, AlertTriangle, Info, Filter } from 'lucide-react';

const NotificationCenter = ({ storeId = 'STORE-001' }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'incident',
      severity: 'high',
      title: 'Actividad Sospechosa Detectada',
      message: 'Múltiples individuos desconocidos detectados cerca de la caja registradora',
      timestamp: new Date(Date.now() - 5 * 60000),
      read: false,
      location: 'Piso Principal',
      camera: 'CAM-002',
    },
    {
      id: 2,
      type: 'detection',
      severity: 'medium',
      title: 'Vehículo Detectado en Estacionamiento',
      message: 'Nuevo vehículo detectado en el área de estacionamiento',
      timestamp: new Date(Date.now() - 15 * 60000),
      read: false,
      location: 'Estacionamiento',
      camera: 'CAM-005',
    },
    {
      id: 3,
      type: 'alert',
      severity: 'critical',
      title: 'Alerta de Intruso',
      message: 'Entrada no autorizada detectada fuera de horario',
      timestamp: new Date(Date.now() - 45 * 60000),
      read: false,
      location: 'Cuarto Trasero',
      camera: 'CAM-004',
    },
    {
      id: 4,
      type: 'detection',
      severity: 'low',
      title: 'Persona Detectada',
      message: 'Empleado detectado durante horas normales de operación',
      timestamp: new Date(Date.now() - 2 * 3600000),
      read: true,
      location: 'Piso Principal',
      camera: 'CAM-002',
    },
    {
      id: 5,
      type: 'system',
      severity: 'info',
      title: 'Calibración de Cámara Completa',
      message: 'Calibración de CAM-003 completada exitosamente',
      timestamp: new Date(Date.now() - 4 * 3600000),
      read: true,
      location: 'Entrada',
      camera: 'CAM-003',
    },
  ]);

  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [expandedNotif, setExpandedNotif] = useState(null);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-900 border-red-700 text-red-100';
      case 'high':
        return 'bg-orange-900 border-orange-700 text-orange-100';
      case 'medium':
        return 'bg-yellow-900 border-yellow-700 text-yellow-100';
      case 'low':
        return 'bg-blue-900 border-blue-700 text-blue-100';
      case 'info':
        return 'bg-gray-700 border-gray-600 text-gray-100';
      default:
        return 'bg-gray-900 border-gray-700 text-gray-100';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'high':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'medium':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'low':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-gray-400" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'justo ahora';
    if (diffMins < 60) return `hace ${diffMins}m`;
    if (diffHours < 24) return `hace ${diffHours}h`;
    if (diffDays < 7) return `hace ${diffDays}d`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications
    .filter((notif) => {
      if (filterType === 'all') return true;
      if (filterType === 'unread') return !notif.read;
      if (filterType === 'critical') return notif.severity === 'critical' || notif.severity === 'high';
      return notif.type === filterType;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') return b.timestamp - a.timestamp;
      if (sortBy === 'severity') {
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      }
      return 0;
    });

  const unreadCount = notifications.filter((n) => !n.read).length;
  const criticalCount = notifications.filter((n) => n.severity === 'critical' || n.severity === 'high').length;

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Total de Notificaciones</p>
          <p className="text-3xl font-bold text-white">{notifications.length}</p>
        </div>
        <div className="bg-yellow-900/30 rounded-lg p-4 border border-yellow-700/50">
          <p className="text-sm text-yellow-300 mb-1">No Leídas</p>
          <p className="text-3xl font-bold text-yellow-300">{unreadCount}</p>
        </div>
        <div className="bg-red-900/30 rounded-lg p-4 border border-red-700/50">
          <p className="text-sm text-red-300 mb-1">Críticas/Altas</p>
          <p className="text-3xl font-bold text-red-300">{criticalCount}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded text-sm transition ${
                filterType === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterType('unread')}
              className={`px-3 py-1 rounded text-sm transition ${
                filterType === 'unread'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              No Leídas
            </button>
            <button
              onClick={() => setFilterType('critical')}
              className={`px-3 py-1 rounded text-sm transition ${
                filterType === 'critical'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Críticas
            </button>
            <button
              onClick={() => setFilterType('incident')}
              className={`px-3 py-1 rounded text-sm transition ${
                filterType === 'incident'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Incidentes
            </button>
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-700 text-gray-300 rounded px-3 py-1 text-sm hover:bg-gray-600 transition"
            >
              <option value="recent">Más Recientes</option>
              <option value="severity">Por Severidad</option>
            </select>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition"
              >
                Marcar Todas Leídas
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
              >
                Limpiar Todas
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`rounded-lg border transition cursor-pointer ${getSeverityColor(notif.severity)} ${
                !notif.read ? 'shadow-lg' : 'opacity-75'
              }`}
            >
              <div
                className="p-4"
                onClick={() =>
                  setExpandedNotif(expandedNotif === notif.id ? null : notif.id)
                }
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">{getSeverityIcon(notif.severity)}</div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-sm leading-tight">
                          {notif.title}
                        </h4>
                        <p className="text-xs opacity-75 mt-1">{formatDate(notif.timestamp)}</p>
                      </div>
                      {!notif.read && (
                        <div className="w-2 h-2 bg-current rounded-full flex-shrink-0 mt-2"></div>
                      )}
                    </div>

                    {/* Expanded Content */}
                    {expandedNotif === notif.id && (
                      <div className="mt-3 pt-3 border-t border-current opacity-90">
                        <p className="text-sm mb-2">{notif.message}</p>
                        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                          <div>
                            <span className="opacity-75">Ubicación:</span>
                            <p className="font-semibold">{notif.location}</p>
                          </div>
                          <div>
                            <span className="opacity-75">Cámara:</span>
                            <p className="font-semibold">{notif.camera}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {!notif.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notif.id);
                              }}
                              className="flex-1 bg-current/30 hover:bg-current/50 text-current px-2 py-1 rounded text-xs font-semibold transition"
                            >
                              Marcar como Leída
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNotification(notif.id);
                            }}
                            className="flex-1 bg-red-600/30 hover:bg-red-600/50 text-red-200 px-2 py-1 rounded text-xs font-semibold transition"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNotification(notif.id);
                    }}
                    className="flex-shrink-0 opacity-50 hover:opacity-100 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No hay notificaciones que coincidan con tus filtros</p>
          </div>
        )}
      </div>

      {/* Notification Preferences */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-bold mb-4">Preferencias de Notificaciones</h3>
        <div className="space-y-3">
          {[
            { label: 'Incidentes Críticos', enabled: true, color: 'text-red-400' },
            { label: 'Detecciones de Alto Riesgo', enabled: true, color: 'text-orange-400' },
            { label: 'Alertas del Sistema', enabled: true, color: 'text-yellow-400' },
            { label: 'Cámara Fuera de Línea', enabled: false, color: 'text-blue-400' },
          ].map((pref, idx) => (
            <label key={idx} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={pref.enabled}
                className="w-4 h-4 rounded"
              />
              <span className={`text-sm font-medium ${pref.color}`}>{pref.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
