import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, AlertCircle, CheckCircle, InfoIcon } from 'lucide-react';

const AlertNotification = ({
  id = 'ALR-001',
  type = 'warning',
  title = 'Alert Title',
  message = 'Alert message goes here',
  risk = 'high',
  timestamp = new Date(),
  onClose = () => {},
  autoClose = true,
  duration = 5000,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const getAlertStyles = () => {
    switch (type.toLowerCase()) {
      case 'error':
        return {
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-500/40',
          titleColor: 'text-red-400',
          icon: AlertTriangle,
        };
      case 'warning':
        return {
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-500/40',
          titleColor: 'text-yellow-400',
          icon: AlertCircle,
        };
      case 'success':
        return {
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/40',
          titleColor: 'text-green-400',
          icon: CheckCircle,
        };
      case 'info':
        return {
          bgColor: 'bg-blue-500/20',
          borderColor: 'border-blue-500/40',
          titleColor: 'text-blue-400',
          icon: InfoIcon,
        };
      default:
        return {
          bgColor: 'bg-gray-500/20',
          borderColor: 'border-gray-500/40',
          titleColor: 'text-gray-400',
          icon: InfoIcon,
        };
    }
  };

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'bg-red-600 text-white';
      case 'medium':
        return 'bg-yellow-600 text-white';
      case 'low':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  if (!isVisible) return null;

  const styles = getAlertStyles();
  const IconComponent = styles.icon;

  return (
    <div
      className={`${styles.bgColor} ${styles.borderColor} border rounded-lg p-4 backdrop-blur-sm mb-4 animate-in fade-in slide-in-from-top-2`}
    >
      <div className="flex items-start gap-4">
        <IconComponent className={`w-5 h-5 mt-0.5 flex-shrink-0 ${styles.titleColor}`} />

        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold ${styles.titleColor} mb-1`}>{title}</h4>
          <p className="text-sm text-gray-300 mb-2">{message}</p>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-2 items-center">
              <span className={`text-xs font-bold px-2 py-1 rounded ${getRiskColor(risk)}`}>
                Risk: {risk.toUpperCase()}
              </span>
              <span className="text-xs text-gray-400">ID: {id}</span>
            </div>
            <span className="text-xs text-gray-500">
              {new Date(timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="flex-shrink-0 p-1 hover:bg-white/10 rounded transition text-gray-400 hover:text-white"
          aria-label="Cerrar alerta"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Alert Container Component
const AlertContainer = ({ alerts = [], maxAlerts = 3 }) => {
  const [displayedAlerts, setDisplayedAlerts] = useState(alerts);

  useEffect(() => {
    setDisplayedAlerts(alerts.slice(0, maxAlerts));
  }, [alerts, maxAlerts]);

  const handleCloseAlert = (alertId) => {
    setDisplayedAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md space-y-2">
      {displayedAlerts.map((alert) => (
        <AlertNotification
          key={alert.id}
          {...alert}
          onClose={() => handleCloseAlert(alert.id)}
        />
      ))}
    </div>
  );
};

export { AlertNotification, AlertContainer };
export default AlertNotification;
