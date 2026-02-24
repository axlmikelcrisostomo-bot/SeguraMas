import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut } from 'lucide-react';
import { useAuthStore } from '../store';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register, loading, error, clearError } = useAuthStore();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: 'demo@yolandita.com',
    password: 'demo1234',
    name: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    let success;
    if (isRegister) {
      success = await register(formData.email, formData.password, formData.name);
    } else {
      success = await login(formData.email, formData.password);
    }

    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-lg mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Yolandita</h1>
          <p className="text-gray-400 mt-2">Sistema de Seguridad con IA</p>
        </div>

        {/* Form Card */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {isRegister ? 'Crear Cuenta' : 'Bienvenido'}
            </h2>
            <p className="text-gray-400 text-sm">
              {isRegister
                ? 'Regístrate para comenzar'
                : 'Accede a tu panel de seguridad'}
            </p>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-700/50 rounded-lg p-3">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Juan Pérez"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  required={isRegister}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="admin@store.com"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-2 rounded-lg transition"
            >
              {loading
                ? 'Procesando...'
                : isRegister
                  ? 'Crear Cuenta'
                  : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="bg-blue-900/30 border border-blue-700/30 rounded-lg p-3">
            <p className="text-xs text-blue-300 font-semibold mb-1">Credenciales Demo:</p>
            <p className="text-xs text-blue-400">Email: demo@yolandita.com</p>
            <p className="text-xs text-blue-400">Contraseña: demo1234</p>
          </div>

          {/* Toggle */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              {isRegister ? '¿Ya tienes cuenta?' : "¿No tienes cuenta?"}{' '}
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-blue-400 hover:text-blue-300 font-semibold transition"
              >
                {isRegister ? 'Iniciar Sesión' : 'Registrarse'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
