import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';

const getApiUrl = () => import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export const useIncidentStore = create((set, get) => ({
  // State
  incidents: [],
  selectedIncident: null,
  loading: false,
  error: null,
  filters: {
    risk_level: 'all',
    status: 'all',
    searchTerm: '',
  },

  // Actions
  setIncidents: (incidents) => set({ incidents }),
  setSelectedIncident: (incident) => set({ selectedIncident: incident }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),

  fetchIncidents: async () => {
    set({ loading: true, error: null });
    try {
      const apiUrl = getApiUrl();
      const headers = useAuthStore.getState().getHeaders();
      const response = await fetch(`${apiUrl}/incidents`, {
        headers,
      });

      if (!response.ok) throw new Error('Failed to fetch incidents');

      const data = await response.json();
      set({ incidents: data.incidents || [], loading: false });

      return true;
    } catch (err) {
      set({ error: err.message, loading: false });
      return false;
    }
  },

  getFilteredIncidents: () => {
    const { incidents, filters } = get();
    return incidents.filter((incident) => {
      if (filters.risk_level !== 'all' && incident.risk_level !== filters.risk_level)
        return false;
      if (filters.status !== 'all' && incident.status !== filters.status)
        return false;
      if (
        filters.searchTerm &&
        !incident.description?.toLowerCase().includes(filters.searchTerm.toLowerCase())
      )
        return false;
      return true;
    });
  },

  createIncident: async (incidentData) => {
    set({ loading: true, error: null });
    try {
      const apiUrl = getApiUrl();
      const headers = useAuthStore.getState().getHeaders();
      const response = await fetch(`${apiUrl}/incidents`, {
        method: 'POST',
        headers,
        body: JSON.stringify(incidentData),
      });

      if (!response.ok) throw new Error('Failed to create incident');

      const newIncident = await response.json();
      set((state) => ({
        incidents: [newIncident, ...state.incidents],
        loading: false,
      }));

      return true;
    } catch (err) {
      set({ error: err.message, loading: false });
      return false;
    }
  },

  updateIncident: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const apiUrl = getApiUrl();
      const headers = useAuthStore.getState().getHeaders();
      const response = await fetch(`${apiUrl}/incidents/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update incident');

      const updated = await response.json();
      set((state) => ({
        incidents: state.incidents.map((i) => (i.id === id ? updated : i)),
        loading: false,
      }));

      return true;
    } catch (err) {
      set({ error: err.message, loading: false });
      return false;
    }
  },

  deleteIncident: async (id) => {
    set({ loading: true, error: null });
    try {
      const apiUrl = getApiUrl();
      const headers = useAuthStore.getState().getHeaders();
      const response = await fetch(`${apiUrl}/incidents/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) throw new Error('Failed to delete incident');

      set((state) => ({
        incidents: state.incidents.filter((i) => i.id !== id),
        loading: false,
      }));

      return true;
    } catch (err) {
      set({ error: err.message, loading: false });
      return false;
    }
  },

  confirmIncident: async (id) => {
    return get().updateIncident(id, { user_confirmed: true });
  },

  clearError: () => set({ error: null }),
}));
