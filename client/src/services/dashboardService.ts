import api from '../api/axios';

// interface for dashboard structure
export interface DashboardData {
  income: number;
  liveBooks: any[];
  pieChart: any[];
  earningsSummary: any[];
}

// 👤 For the Book Owner
export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await api.get('/owner/stats'); 
    const stats = response.data?.data || {};
    return {
      income: stats.income || 0,
      liveBooks: stats.liveBooks || [],
      pieChart: stats.pieChart || [],
      earningsSummary: stats.earningsSummary || []
    };
  } catch (error: any) {
    console.error("Owner Dashboard Error:", error?.response?.data || error.message);
    throw error;
  }
};

export const fetchOwnerDashboardData = async () => {
  try {
    const response = await api.get('/owner/stats'); 
    return response.data?.data || {}; 
  } catch (error: any) {
    console.error("Owner Dashboard Service Error:", error?.response?.data || error.message);
    throw error;
  }
};

// 🔑 For the Admin [cite: 2026-02-08]
export const fetchAdminDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await api.get('/admin/stats');
    const stats = response.data?.data || response.data || {};
    return {
      income: stats.income || 0,
      liveBooks: stats.liveBooks || [],
      pieChart: stats.pieChart || [],
      earningsSummary: stats.earningsSummary || []
    };
  } catch (error: any) {
    console.error("Admin Dashboard Error:", error?.response?.data || error.message);
    throw error;
  }
};