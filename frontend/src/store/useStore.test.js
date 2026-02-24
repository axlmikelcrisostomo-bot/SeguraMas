import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../store/useAuthStore';
import { useIncidentStore } from '../store/useIncidentStore';
import { useAppStore } from '../store/useAppStore';

describe('Store - useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  });

  it('should initialize with no user', () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.token).toBe(null);
  });

  it('should logout user', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setUser({ name: 'Test User' });
    });

    expect(result.current.user).toBeDefined();

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.token).toBe(null);
  });

  it('should get headers with authorization', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      useAuthStore.setState({ token: 'test_token_123' });
    });

    const headers = result.current.getHeaders();
    expect(headers.Authorization).toBe('Bearer test_token_123');
    expect(headers['Content-Type']).toBe('application/json');
  });
});

describe('Store - useIncidentStore', () => {
  beforeEach(() => {
    useIncidentStore.setState({
      incidents: [],
      selectedIncident: null,
      loading: false,
      error: null,
      filters: {
        risk_level: 'all',
        status: 'all',
        searchTerm: '',
      },
    });
  });

  it('should initialize with empty incidents', () => {
    const { result } = renderHook(() => useIncidentStore());
    expect(result.current.incidents).toEqual([]);
    expect(result.current.selectedIncident).toBe(null);
  });

  it('should set incidents', () => {
    const { result } = renderHook(() => useIncidentStore());
    const testIncidents = [
      {
        id: 1,
        description: 'Test incident',
        risk_level: 'HIGH',
        status: 'open',
        user_confirmed: false,
      },
      {
        id: 2,
        description: 'Another incident',
        risk_level: 'LOW',
        status: 'resolved',
        user_confirmed: true,
      },
    ];

    act(() => {
      result.current.setIncidents(testIncidents);
    });

    expect(result.current.incidents).toEqual(testIncidents);
  });

  it('should filter incidents by risk level', () => {
    const { result } = renderHook(() => useIncidentStore());
    const testIncidents = [
      { id: 1, risk_level: 'HIGH', status: 'open', description: 'Test', user_confirmed: false },
      { id: 2, risk_level: 'LOW', status: 'open', description: 'Test2', user_confirmed: false },
    ];

    act(() => {
      result.current.setIncidents(testIncidents);
      result.current.setFilter('risk_level', 'HIGH');
    });

    const filtered = result.current.getFilteredIncidents();
    expect(filtered.length).toBe(1);
    expect(filtered[0].risk_level).toBe('HIGH');
  });

  it('should filter incidents by status', () => {
    const { result } = renderHook(() => useIncidentStore());
    const testIncidents = [
      { id: 1, risk_level: 'HIGH', status: 'open', description: 'Test', user_confirmed: false },
      { id: 2, risk_level: 'LOW', status: 'resolved', description: 'Test2', user_confirmed: false },
    ];

    act(() => {
      result.current.setIncidents(testIncidents);
      result.current.setFilter('status', 'resolved');
    });

    const filtered = result.current.getFilteredIncidents();
    expect(filtered.length).toBe(1);
    expect(filtered[0].status).toBe('resolved');
  });
});

describe('Store - useAppStore', () => {
  beforeEach(() => {
    useAppStore.setState({
      sidebarOpen: true,
      theme: 'dark',
      notifications: [],
      currentStore: 'STORE-001',
      cameras: [],
      loading: false,
    });
  });

  it('should toggle sidebar', () => {
    const { result } = renderHook(() => useAppStore());
    expect(result.current.sidebarOpen).toBe(true);

    act(() => {
      result.current.toggleSidebar();
    });

    expect(result.current.sidebarOpen).toBe(false);

    act(() => {
      result.current.toggleSidebar();
    });

    expect(result.current.sidebarOpen).toBe(true);
  });

  it('should add notification', () => {
    const { result } = renderHook(() => useAppStore());
    const testNotification = {
      type: 'alert',
      message: 'Test notification',
    };

    act(() => {
      result.current.addNotification(testNotification);
    });

    expect(result.current.notifications.length).toBe(1);
    expect(result.current.notifications[0].message).toBe('Test notification');
  });

  it('should remove notification', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.addNotification({ message: 'Test 1' });
      result.current.addNotification({ message: 'Test 2' });
    });

    expect(result.current.notifications.length).toBe(2);

    const notifId = result.current.notifications[0].id;

    act(() => {
      result.current.removeNotification(notifId);
    });

    expect(result.current.notifications.length).toBe(1);
  });

  it('should clear all notifications', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.addNotification({ message: 'Test 1' });
      result.current.addNotification({ message: 'Test 2' });
    });

    expect(result.current.notifications.length).toBe(2);

    act(() => {
      result.current.clearNotifications();
    });

    expect(result.current.notifications.length).toBe(0);
  });

  it('should set current store', () => {
    const { result } = renderHook(() => useAppStore());
    expect(result.current.currentStore).toBe('STORE-001');

    act(() => {
      result.current.setCurrentStore('STORE-002');
    });

    expect(result.current.currentStore).toBe('STORE-002');
  });
});
