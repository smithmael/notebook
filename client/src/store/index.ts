import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axios';

interface AppState {
  // Auth State
  token: string | null;
  userRole: 'ADMIN' | 'OWNER' | null;
  
  // Dashboard Data State
  income: number;
  pieChart: any[];
  liveBooks: any[];
  earningsSummary: any[];
  loading: boolean;
  error: string | null;

  // Actions
  setAuth: (token: string, role: 'ADMIN' | 'OWNER') => void;
  logout: () => void;
  fetchDashboard: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      token: null,
      userRole: null,
      income: 0,
      pieChart: [],
      liveBooks: [],
      earningsSummary: [],
      loading: false,
      error: null,

      setAuth: (token, role) => set({ token, userRole: role }),
      
      logout: () => {
        set({ token: null, userRole: null, income: 0, liveBooks: [] });
        localStorage.clear();
      },

      fetchDashboard: async () => {
        set({ loading: true });
        try {
          const response = await api.get('/dashboard');
          set({ 
            income: response.data.income,
            pieChart: response.data.pieChart,
            liveBooks: response.data.liveBooks,
            earningsSummary: response.data.earningsSummary,
            loading: false,
            error: null
          });
        } catch (err: any) {
          set({ error: "Failed to sync data", loading: false });
        }
      },
    }),
    // cspell:ignore partialize
    { name: 'book-rent-storage', partialize: (state) => ({ token: state.token, userRole: state.userRole }) }
  )
);