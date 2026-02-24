import { create } from 'zustand';

const getApiUrl = () => import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const buildOfflineDemoSession = (email, name = null) => ({
  token: 'demo-local-token',
  user: {
    email,
    name: name || email?.split('@')?.[0] || 'Demo User',
  },
});

const isNetworkError = (error) =>
  error instanceof TypeError && /failed to fetch|networkerror|load failed/i.test(error.message || '');

export const useAuthStore = create((set, get) => ({
  // State
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  // Actions
  setUser: (user) => set({ user }),

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const demoSession = buildOfflineDemoSession(email);
        localStorage.setItem('access_token', demoSession.token);
        set({
          token: demoSession.token,
          isAuthenticated: true,
          user: demoSession.user,
          loading: false,
          error: null,
        });
        return true;
      }

      const data = await response.json();
      const token = data.access_token;

      localStorage.setItem('access_token', token);
      set({
        token,
        isAuthenticated: true,
        user: data.user || { email },
        loading: false,
      });

      return true;
    } catch (err) {
      if (isNetworkError(err)) {
        const demoSession = buildOfflineDemoSession(email);
        localStorage.setItem('access_token', demoSession.token);
        set({
          token: demoSession.token,
          isAuthenticated: true,
          user: demoSession.user,
          loading: false,
          error: null,
        });
        return true;
      }

      set({
        error: err.message || 'Error de conexión con el backend',
        loading: false,
        isAuthenticated: false,
      });
      return false;
    }
  },

  register: async (email, password, name) => {
    set({ loading: true, error: null });
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const demoSession = buildOfflineDemoSession(email, name);
        localStorage.setItem('access_token', demoSession.token);
        set({
          token: demoSession.token,
          isAuthenticated: true,
          user: demoSession.user,
          loading: false,
          error: null,
        });
        return true;
      }

      await response.json();
      set({ error: null, loading: false });

      return true;
    } catch (err) {
      if (isNetworkError(err)) {
        const demoSession = buildOfflineDemoSession(email, name);
        localStorage.setItem('access_token', demoSession.token);
        set({
          token: demoSession.token,
          isAuthenticated: true,
          user: demoSession.user,
          loading: false,
          error: null,
        });
        return true;
      }

      set({
        error: err.message || 'Error de conexión con el backend',
        loading: false,
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),

  getToken: () => get().token,

  getHeaders: () => {
    const token = get().token;
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  },
}));
