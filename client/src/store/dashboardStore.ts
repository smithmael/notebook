import { create } from 'zustand';
import api from '../api/axios';

interface DashboardState {
  income: number;
  pieChart: any[];
  liveBooks: any[];
  earningsSummary: any[];
  loading: boolean;
  error: string | null;
  fetchDashboard: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  income: 0,
  pieChart: [],
  liveBooks: [],
  earningsSummary: [],
  loading: false,
  error: null,

  fetchDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/dashboard');
      const { income, pieChart, liveBooks, earningsSummary } = response.data;
      
      set({ 
        income: income || 0,
        pieChart: pieChart || [],
        liveBooks: liveBooks || [],
        earningsSummary: earningsSummary || [],
        loading: false 
      });
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || "Server connection failed", 
        loading: false 
      });
    }
  },
}));