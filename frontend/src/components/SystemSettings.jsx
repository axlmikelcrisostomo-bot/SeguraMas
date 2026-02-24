import React, { useState } from 'react';
import { Settings, Save, AlertCircle, CheckCircle, ToggleLeft } from 'lucide-react';

const SystemSettings = ({ storeId = 'STORE-001' }) => {
  const [settings, setSettings] = useState({
    system: {
      storeName: 'Demo Store',
      storeId: 'STORE-001',
      location: 'Downtown',
      timezone: 'America/New_York',
      language: 'en',
    },
    detection: {
      confidenceThreshold: 75,
      enableYOLO: true,
      enableFaceRecognition: false,
      enableLicensePlate: false,
      minDetectionArea: 20,
      maxFrameDelay: 100,
    },
    alerts: {
      criticalEmailNotify: true,
      criticalSmsNotify: true,
      highEmailNotify: true,
      highSmsNotify: false,
      alertCooldown: 300,
      enableSound: true,
    },
    storage: {
      videoRetention: 30,
      enableCloudBackup: true,
      compressionLevel: 'medium',
      maxStorageGB: 500,
    },
    security: {
      enableTwoFactor: true,
      sessionTimeout: 1800,
      requirePasswordChange: 90,
      enableAuditLog: true,
    },
  });

  const [activeTab, setActiveTab] = useState('system');
  const [saveStatus, setSaveStatus] = useState(null);

  const handleInputChange = (category, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const handleToggle = (category, field) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: !prev[category][field],
      },
    }));
  };

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1000);
  };

  const Section = ({ title, children }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
        {title}
      </h3>
      {children}
    </div>
  );

  const FormField = ({ label, description, children }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Configuración del Sistema
        </h2>
        {saveStatus && (
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              saveStatus === 'success'
                ? 'bg-green-900/50 text-green-300'
                : 'bg-blue-900/50 text-blue-300'
            }`}
          >
            {saveStatus === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <div className="animate-spin">
                <Settings className="w-5 h-5" />
              </div>
            )}
            {saveStatus === 'success' ? 'Configuración Guardada' : 'Guardando...'}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-700 overflow-x-auto">
        {['system', 'detection', 'alerts', 'storage', 'security'].map((tab) => {
          const labels = {
            system: 'Sistema',
            detection: 'Detección',
            alerts: 'Alertas',
            storage: 'Almacenamiento',
            security: 'Seguridad'
          };
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium text-sm transition whitespace-nowrap ${
                activeTab === tab
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-blue-300'
              }`}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 space-y-8">
        {/* System Settings */}
        {activeTab === 'system' && (
          <div className="space-y-6 animate-fadeIn">
            <Section title="Información de la Tienda">
              <FormField label="Nombre de la Tienda">
                <input
                  type="text"
                  value={settings.system.storeName}
                  onChange={(e) =>
                    handleInputChange('system', 'storeName', e.target.value)
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </FormField>

              <FormField label="ID de Tienda" description="Identificador único (solo lectura)">
                <input
                  type="text"
                  value={settings.system.storeId}
                  disabled
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-400 cursor-not-allowed"
                />
              </FormField>

              <FormField label="Ubicación">
                <input
                  type="text"
                  value={settings.system.location}
                  onChange={(e) =>
                    handleInputChange('system', 'location', e.target.value)
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Zona Horaria">
                  <select
                    value={settings.system.timezone}
                    onChange={(e) =>
                      handleInputChange('system', 'timezone', e.target.value)
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="America/New_York">Hora del Este</option>
                    <option value="America/Chicago">Hora Central</option>
                    <option value="America/Denver">Hora de Montaña</option>
                    <option value="America/Los_Angeles">Hora del Pacífico</option>
                  </select>
                </FormField>

                <FormField label="Idioma">
                  <select
                    value={settings.system.language}
                    onChange={(e) =>
                      handleInputChange('system', 'language', e.target.value)
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="en">Inglés</option>
                    <option value="es">Español</option>
                    <option value="fr">Francés</option>
                  </select>
                </FormField>
              </div>
            </Section>
          </div>
        )}

        {/* Detection Settings */}
        {activeTab === 'detection' && (
          <div className="space-y-6 animate-fadeIn">
            <Section title="Configuración de Detección">
              <FormField
                label="Umbral de Confianza de Detección"
                description="Solo se activarán detecciones por encima de este nivel de confianza"
              >
                <div className="flex gap-4 items-center">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.detection.confidenceThreshold}
                    onChange={(e) =>
                      handleInputChange(
                        'detection',
                        'confidenceThreshold',
                        parseInt(e.target.value)
                      )
                    }
                    className="flex-1"
                  />
                  <span className="text-lg font-semibold text-blue-400 w-12 text-right">
                    {settings.detection.confidenceThreshold}%
                  </span>
                </div>
              </FormField>

              <FormField label="Área Mínima de Detección">
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={settings.detection.minDetectionArea}
                    onChange={(e) =>
                      handleInputChange(
                        'detection',
                        'minDetectionArea',
                        parseInt(e.target.value)
                      )
                    }
                    className="w-32 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-gray-400 py-2">% del cuadro</span>
                </div>
              </FormField>

              <FormField label="Retardo Máximo de Cuadros">
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={settings.detection.maxFrameDelay}
                    onChange={(e) =>
                      handleInputChange(
                        'detection',
                        'maxFrameDelay',
                        parseInt(e.target.value)
                      )
                    }
                    className="w-32 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-gray-400 py-2">milisegundos</span>
                </div>
              </FormField>
            </Section>

            <Section title="Funciones Avanzadas">
              <div className="space-y-3">
                {[
                  {
                    key: 'enableYOLO',
                    label: 'Habilitar Detección YOLOv8',
                    desc: 'Usar red neuronal avanzada para detección de objetos',
                  },
                  {
                    key: 'enableFaceRecognition',
                    label: 'Habilitar Reconocimiento Facial',
                    desc: 'Identificar individuos en base de datos almacenada',
                  },
                  {
                    key: 'enableLicensePlate',
                    label: 'Habilitar Reconocimiento de Placas',
                    desc: 'Detectar y registrar placas de vehículos',
                  },
                ].map((feature) => (
                  <label
                    key={feature.key}
                    className="flex items-center gap-3 p-3 rounded border border-gray-700 hover:border-gray-600 cursor-pointer transition"
                  >
                    <input
                      type="checkbox"
                      checked={settings.detection[feature.key]}
                      onChange={() =>
                        handleToggle('detection', feature.key)
                      }
                      className="w-4 h-4 rounded"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-200">
                        {feature.label}
                      </p>
                      <p className="text-xs text-gray-500">{feature.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </Section>
          </div>
        )}

        {/* Alert Settings */}
        {activeTab === 'alerts' && (
          <div className="space-y-6 animate-fadeIn">
            <Section title="Canales de Notificación">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    key: 'criticalEmailNotify',
                    label: 'Email para Alertas Críticas',
                  },
                  {
                    key: 'criticalSmsNotify',
                    label: 'SMS para Alertas Críticas',
                  },
                  {
                    key: 'highEmailNotify',
                    label: 'Email para Alertas Altas',
                  },
                  {
                    key: 'highSmsNotify',
                    label: 'SMS para Alertas Altas',
                  },
                ].map((notif) => (
                  <label key={notif.key} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.alerts[notif.key]}
                      onChange={() => handleToggle('alerts', notif.key)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-gray-300">{notif.label}</span>
                  </label>
                ))}
              </div>
            </Section>

            <Section title="Comportamiento de Alertas">
              <FormField
                label="Período de Espera de Alertas"
                description="Tiempo mínimo entre alertas similares"
              >
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={settings.alerts.alertCooldown}
                    onChange={(e) =>
                      handleInputChange(
                        'alerts',
                        'alertCooldown',
                        parseInt(e.target.value)
                      )
                    }
                    className="w-32 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-gray-400 py-2">segundos</span>
                </div>
              </FormField>

              <label className="flex items-center gap-3 p-3 rounded border border-gray-700 hover:border-gray-600 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={settings.alerts.enableSound}
                  onChange={() => handleToggle('alerts', 'enableSound')}
                  className="w-4 h-4 rounded"
                />
                <div>
                  <p className="text-sm font-medium text-gray-200">
                    Habilitar Sonidos de Alerta
                  </p>
                  <p className="text-xs text-gray-500">
                    Reproducir notificación de audio para nuevas alertas
                  </p>
                </div>
              </label>
            </Section>
          </div>
        )}

        {/* Storage Settings */}
        {activeTab === 'storage' && (
          <div className="space-y-6 animate-fadeIn">
            <Section title="Video Storage">
              <FormField label="Video Retention Period">
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={settings.storage.videoRetention}
                    onChange={(e) =>
                      handleInputChange(
                        'storage',
                        'videoRetention',
                        parseInt(e.target.value)
                      )
                    }
                    className="w-32 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-gray-400 py-2">días</span>
                </div>
              </FormField>

              <FormField label="Capacidad Máxima de Almacenamiento">
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={settings.storage.maxStorageGB}
                    onChange={(e) =>
                      handleInputChange(
                        'storage',
                        'maxStorageGB',
                        parseInt(e.target.value)
                      )
                    }
                    className="w-32 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-gray-400 py-2">GB</span>
                </div>
              </FormField>

              <FormField label="Nivel de Compresión">
                <select
                  value={settings.storage.compressionLevel}
                  onChange={(e) =>
                    handleInputChange(
                      'storage',
                      'compressionLevel',
                      e.target.value
                    )
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="low">Bajo (Mayor calidad, más almacenamiento)</option>
                  <option value="medium">Medio (Equilibrado)</option>
                  <option value="high">Alto (Menor calidad, menos almacenamiento)</option>
                </select>
              </FormField>
            </Section>

            <Section title="Respaldo">
              <label className="flex items-center gap-3 p-3 rounded border border-gray-700 hover:border-gray-600 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={settings.storage.enableCloudBackup}
                  onChange={() =>
                    handleToggle('storage', 'enableCloudBackup')
                  }
                  className="w-4 h-4 rounded"
                />
                <div>
                  <p className="text-sm font-medium text-gray-200">
                    Habilitar Respaldo en la Nube
                  </p>
                  <p className="text-xs text-gray-500">
                    Respaldar automáticamente grabaciones críticas en almacenamiento en la nube
                  </p>
                </div>
              </label>
            </Section>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-6 animate-fadeIn">
            <Section title="Seguridad de Usuarios">
              <label className="flex items-center gap-3 p-3 rounded border border-gray-700 hover:border-gray-600 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={settings.security.enableTwoFactor}
                  onChange={() =>
                    handleToggle('security', 'enableTwoFactor')
                  }
                  className="w-4 h-4 rounded"
                />
                <div>
                  <p className="text-sm font-medium text-gray-200">
                    Requerir 2FA
                  </p>
                  <p className="text-xs text-gray-500">
                    Autenticación de dos factores para todos los usuarios
                  </p>
                </div>
              </label>

              <FormField label="Tiempo de Expiración de Sesión">
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) =>
                      handleInputChange(
                        'security',
                        'sessionTimeout',
                        parseInt(e.target.value)
                      )
                    }
                    className="w-32 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-gray-400 py-2">segundos</span>
                </div>
              </FormField>

              <FormField label="Intervalo de Cambio de Contraseña">
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={settings.security.requirePasswordChange}
                    onChange={(e) =>
                      handleInputChange(
                        'security',
                        'requirePasswordChange',
                        parseInt(e.target.value)
                      )
                    }
                    className="w-32 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-gray-400 py-2">días</span>
                </div>
              </FormField>
            </Section>

            <Section title="Auditoría y Registro">
              <label className="flex items-center gap-3 p-3 rounded border border-gray-700 hover:border-gray-600 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={settings.security.enableAuditLog}
                  onChange={() =>
                    handleToggle('security', 'enableAuditLog')
                  }
                  className="w-4 h-4 rounded"
                />
                <div>
                  <p className="text-sm font-medium text-gray-200">
                    Habilitar Registro de Auditoría
                  </p>
                  <p className="text-xs text-gray-500">
                    Registrar todas las actividades del sistema y usuarios
                  </p>
                </div>
              </label>
            </Section>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold transition"
        >
          <Save className="w-5 h-5" />
          Guardar Configuración
        </button>
        <button className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded font-semibold transition">
          Restablecer Valores Predeterminados
        </button>
      </div>
    </div>
  );
};

export default SystemSettings;
