import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';

const getApiUrl = () => import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export const useMetricsStore = create((set, get) => ({
  // State
  roiMetrics: null,
  detectionMetrics: null,
  heatmapData: null,
  riskPatterns: null,
  loading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchROIMetrics: async (storeId) => {
    set({ loading: true, error: null });
    try {
      const headers = useAuthStore.getState().getHeaders();
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/analytics/roi?store_id=${storeId}`, {
        headers,
      });

      if (!response.ok) throw new Error('Failed to fetch ROI metrics');

      const data = await response.json();
      set({ roiMetrics: data, loading: false });

      return true;
    } catch (err) {
      set({ error: err.message, loading: false });
      return false;
    }
  },

  fetchDetectionMetrics: async (storeId, days = 7) => {
    set({ loading: true, error: null });
    try {
      const headers = useAuthStore.getState().getHeaders();
      const apiUrl = getApiUrl();
      const response = await fetch(
        `${apiUrl}/analytics/detections?store_id=${storeId}&days=${days}`,
        { headers }
      );

      if (!response.ok) throw new Error('Failed to fetch detection metrics');

      const data = await response.json();
      set({ detectionMetrics: data, loading: false });

      return true;
    } catch (err) {
      set({ error: err.message, loading: false });
      return false;
    }
  },

  fetchHeatmapData: async (storeId) => {
    set({ loading: true, error: null });
    try {
      const headers = useAuthStore.getState().getHeaders();
      const apiUrl = getApiUrl();
      const response = await fetch(
        `${apiUrl}/analytics/heatmap?store_id=${storeId}`,
        { headers }
      );

      if (!response.ok) throw new Error('Failed to fetch heatmap data');

      const data = await response.json();
      set({ heatmapData: data, loading: false });

      return true;
    } catch (err) {
      set({ error: err.message, loading: false });
      return false;
    }
  },

  fetchRiskPatterns: async (storeId) => {
    set({ loading: true, error: null });
    try {
      const headers = useAuthStore.getState().getHeaders();
      const apiUrl = getApiUrl();
      const response = await fetch(
        `${apiUrl}/analytics/patterns?store_id=${storeId}`,
        { headers }
      );

      if (!response.ok) throw new Error('Failed to fetch risk patterns');

      const data = await response.json();
      set({ riskPatterns: data, loading: false });

      return true;
    } catch (err) {
      set({ error: err.message, loading: false });
      return false;
    }
  },

  fetchAllMetrics: async (storeId) => {
    set({ loading: true, error: null });
    try {
      const headers = useAuthStore.getState().getHeaders();
      const apiUrl = getApiUrl();

      const results = await Promise.all([
        fetch(`${apiUrl}/analytics/roi?store_id=${storeId}`, { headers }),
        fetch(`${apiUrl}/analytics/detections?store_id=${storeId}`, { headers }),
        fetch(`${apiUrl}/analytics/heatmap?store_id=${storeId}`, { headers }),
        fetch(`${apiUrl}/analytics/patterns?store_id=${storeId}`, { headers }),
      ]);

      const [roiRes, detectionRes, heatmapRes, patternsRes] = results;

      if (!roiRes.ok || !detectionRes.ok || !heatmapRes.ok || !patternsRes.ok) {
        throw new Error('Failed to fetch some metrics');
      }

      const [roi, detection, heatmap, patterns] = await Promise.all(
        results.map((res) => res.json())
      );

      set({
        roiMetrics: roi,
        detectionMetrics: detection,
        heatmapData: heatmap,
        riskPatterns: patterns,
        loading: false,
      });

      return true;
    } catch (err) {
      set({ error: err.message, loading: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
