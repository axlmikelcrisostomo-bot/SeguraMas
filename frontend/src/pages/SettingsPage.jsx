import React from 'react';
import { SystemSettings, UserManagement, NotificationCenter } from '../components';
import { Settings } from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = React.useState('system');

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Configuración del Sistema</h1>
        <p className="text-gray-400">
          Administra configuraciones del sistema, usuarios y preferencias
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-700">
        {[
          { id: 'system', label: 'Sistema' },
          { id: 'users', label: 'Usuarios' },
          { id: 'notifications', label: 'Notificaciones' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium text-sm transition whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-blue-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeTab === 'system' && <div className="animate-fadeIn"><SystemSettings /></div>}
        {activeTab === 'users' && <div className="animate-fadeIn"><UserManagement /></div>}
        {activeTab === 'notifications' && <div className="animate-fadeIn"><NotificationCenter /></div>}
      </div>
    </div>
  );
};

export default SettingsPage;
