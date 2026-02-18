import api from '../api/axios'; 

export const fetchDashboardData = async () => {
  try {
    const response = await api.get('/dashboard');
    
    // ✅ Always default to an empty object to prevent frontend crashes
    const dashboardStats = response.data?.data || {}; 
    
    // Ensure nested arrays also have defaults for the charts/tables
    return {
      income: dashboardStats.income || 0,
      liveBooks: dashboardStats.liveBooks || [],
      pieChart: dashboardStats.pieChart || [],
      earningsSummary: dashboardStats.earningsSummary || []
    };
  } catch (error: any) {
    // 🛡️ Real error logging for debugging Prisma v7 issues [cite: 2026-02-08, 2026-02-13]
    console.error("Dashboard Service Error:", error?.response?.data || error.message);
    throw error;
  }
};