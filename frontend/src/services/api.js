import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Health endpoints
export const getHealth = () => api.get('/health');
export const getDetailedHealth = () => api.get('/health/detailed');

// Video endpoints
export const startVideoStream = (cameraId, streamUrl) =>
  api.post('/video/stream/start', { camera_id: cameraId, stream_url: streamUrl });

export const stopVideoStream = (cameraId) =>
  api.post('/video/stream/stop', { camera_id: cameraId });

export const listActiveStreams = () => api.get('/video/streams');

// Incident endpoints
export const reportIncident = (cameraId, incidentType, riskLevel, description) =>
  api.post('/incidents/report', {
    camera_id: cameraId,
    incident_type: incidentType,
    risk_level: riskLevel,
    description: description,
  });

export const getIncidents = (cameraId, riskLevel, limit = 50, offset = 0) =>
  api.get('/incidents', {
    params: { camera_id: cameraId, risk_level: riskLevel, limit, offset },
  });

export const getIncident = (incidentId) => api.get(`/incidents/${incidentId}`);

export const confirmIncident = (incidentId, confirmed) =>
  api.put(`/incidents/${incidentId}/confirm`, { confirmed });

// Analytics endpoints
export const getRoiMetrics = (storeId, days = 30) =>
  api.get('/analytics/roi', { params: { store_id: storeId, days } });

export const getHeatmapData = (cameraId, days = 7) =>
  api.get('/analytics/heatmap', { params: { camera_id: cameraId, days } });

export const getDetectionMetrics = (cameraId, days = 30) =>
  api.get('/analytics/detection-metrics', { params: { camera_id: cameraId, days } });

export const getRiskPatterns = (storeId, days = 30) =>
  api.get('/analytics/risk-patterns', { params: { store_id: storeId, days } });

export const getOperationalSuggestions = (storeId) =>
  api.get('/analytics/operational-suggestions', { params: { store_id: storeId } });

export default api;
