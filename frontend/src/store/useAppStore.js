import { create } from 'zustand';

export const useAppStore = create((set) => ({
  // State
  sidebarOpen: true,
  theme: localStorage.getItem('theme') || 'dark',
  notifications: [],
  currentStore: 'STORE-001',
  cameras: [],
  loading: false,

  // Actions
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
  },

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          id: Date.now(),
          ...notification,
        },
        ...state.notifications,
      ],
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearNotifications: () => set({ notifications: [] }),

  setCurrentStore: (storeId) => set({ currentStore: storeId }),

  setCameras: (cameras) => set({ cameras }),

  fetchCameras: async (storeId) => {
    set({ loading: true });
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
      const response = await fetch(`${apiUrl}/video?store_id=${storeId}`);

      if (!response.ok) throw new Error('Failed to fetch cameras');

      const data = await response.json();
      set({ cameras: data.streams || [], loading: false });

      return true;
    } catch (err) {
      console.error(err);
      set({ loading: false });
      return false;
    }
  },
}));
