import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Home,
  BarChart3,
  AlertCircle,
  Camera,
  Settings,
  User,
  LogOut,
  Bell,
  Clock,
} from 'lucide-react';
import { useAuthStore, useAppStore } from '../store';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const [currentTime, setCurrentTime] = React.useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { path: '/', label: 'Panel', icon: Home },
    { path: '/analytics', label: 'Analíticas', icon: BarChart3 },
    { path: '/incidents', label: 'Incidentes', icon: AlertCircle },
    { path: '/cameras', label: 'Cámaras', icon: Camera },
    { path: '/settings', label: 'Configuración', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#0b0b10] via-gray-950 to-[#200b0b]">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-950/80 border-r border-gray-800/80 backdrop-blur transition-transform duration-300 md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">Y</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-cyan-400">Yolandita</h1>
                <p className="text-xs text-purple-300">Sistema de Seguridad</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 space-y-2 px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive(item.path)
                      ? 'bg-brand-primary text-white'
                      : 'text-gray-300 hover:bg-gray-900/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-800/80">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-gray-950/70 border-b border-gray-800/80 backdrop-blur px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 hover:bg-gray-900/60 rounded-lg transition"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <div className="hidden md:block">
              <h2 className="text-2xl font-bold text-white">
                {navItems.find((item) => isActive(item.path))?.label ||'Dashboard'}
              </h2>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-6">
            {/* Time */}
            <div className="hidden sm:flex items-center gap-2 text-gray-300">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-900/60 rounded-lg transition">
              <Bell className="w-6 h-6 text-gray-300" />
              <span className="absolute top-1 right-1 w-3 h-3 bg-brand-accent rounded-full"></span>
            </button>

            {/* User Avatar */}
            <div className="flex items-center gap-3 pl-6 border-l border-gray-800/80">
              <div className="text-right">
                <p className="text-sm font-semibold text-white">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-300">
                  {user?.role || 'Manager'}
                </p>
              </div>
              <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default MainLayout;
