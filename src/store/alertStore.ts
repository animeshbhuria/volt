import { create } from 'zustand';
import type { Alert } from '@/types/alerts';
import type { Role } from '@/constants/auth';
import { getAlerts } from '@/services/mockApi';

interface AlertState {
  alerts: Alert[];
  loading: boolean;
  error: string | null;
  fetchAlerts: (userId: string, role: Role) => Promise<void>;
  dismissAlert: (id: string) => void;
  markRead: (id: string) => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  alerts: [],
  loading: false,
  error: null,
  fetchAlerts: async (userId, role) => {
    set({ loading: true, error: null });
    try {
      const alerts = await getAlerts(userId, role);
      set({ alerts, loading: false });
    } catch (e) {
      set({
        loading: false,
        error: e instanceof Error ? e.message : 'Failed to load alerts',
      });
    }
  },
  dismissAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== id),
    })),
  markRead: (id) =>
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === id ? { ...a, read: true } : a)),
    })),
}));
