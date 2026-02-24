import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import {
  LoginPage,
  HomePage,
  AnalyticsPage,
  IncidentsPage,
  CamerasPage,
  SettingsPage,
  ProfilePage,
} from './pages';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default function App() {
  const { isAuthenticated, token } = useAuthStore();

  useEffect(() => {
    // Verify token on mount
    if (token && !isAuthenticated) {
      // Token exists but not authenticated - attempt re-auth
      console.log('Token found, initializing...');
    }
  }, [token, isAuthenticated]);

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/incidents" element={<IncidentsPage />} />
          <Route path="/cameras" element={<CamerasPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
