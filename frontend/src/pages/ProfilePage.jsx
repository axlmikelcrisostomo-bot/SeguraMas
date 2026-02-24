import React from 'react';
import { useAuthStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Calendar, LogOut, Edit2 } from 'lucide-react';

const ProfilePage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: user?.name || 'John Manager',
    email: user?.email || 'john@store.com',
    phone: user?.phone || '(555) 123-4567',
    role: user?.role || 'Manager',
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Mi Perfil</h1>
        <p className="text-gray-400">Administra tu cuenta y preferencias</p>
      </div>

      {/* Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Avatar & Info */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{formData.name}</h2>
            <p className="text-gray-400 text-sm mb-4">{formData.role}</p>
            <div className="space-y-2 text-sm">
              <p className="text-gray-300">
                <Mail className="w-4 h-4 inline mr-2" />
                {formData.email}
              </p>
              <p className="text-gray-300">
                <Phone className="w-4 h-4 inline mr-2" />
                {formData.phone}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Right - Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Información de la Cuenta</h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm transition"
              >
                <Edit2 className="w-4 h-4" />
                {isEditing ? 'Cancelar' : 'Editar'}
              </button>
            </div>

            {isEditing ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsEditing(false);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold transition"
                >
                  Guardar Cambios
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Nombre Completo</p>
                  <p className="text-lg font-semibold text-white">{formData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Correo Electrónico</p>
                  <p className="text-lg font-semibold text-white">{formData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Número de Teléfono</p>
                  <p className="text-lg font-semibold text-white">{formData.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Rol</p>
                  <p className="text-lg font-semibold text-white">{formData.role}</p>
                </div>
              </div>
            )}
          </div>

          {/* Security Section */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mt-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Configuración de Seguridad</h3>
            <div className="space-y-3">
              <button className="w-full text-left bg-gray-700 hover:bg-gray-600 rounded px-4 py-3 transition">
                <p className="font-semibold text-white">Cambiar Contraseña</p>
                <p className="text-xs text-gray-400">Actualiza tu contraseña regularmente</p>
              </button>
              <button className="w-full text-left bg-gray-700 hover:bg-gray-600 rounded px-4 py-3 transition">
                <p className="font-semibold text-white">Autenticación de Dos Factores</p>
                <p className="text-xs text-gray-400">Mejora la seguridad con 2FA</p>
              </button>
              <button className="w-full text-left bg-gray-700 hover:bg-gray-600 rounded px-4 py-3 transition">
                <p className="font-semibold text-white">Sesiones Activas</p>
                <p className="text-xs text-gray-400">Ver y administrar sesiones activas</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
