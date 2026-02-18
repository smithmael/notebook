import { create } from 'zustand';
import api from '../api/axios';

interface EarningData {
  month: string;
  amount: number;
}

interface BookState {
  books: any[];
  earningsData: EarningData[]; // ✅ New state for chart
  loading: boolean;
  uploadBook: (formData: FormData) => Promise<void>;
  fetchBooks: () => Promise<void>;
  fetchEarnings: () => Promise<void>; // ✅ New action
}

export const useBookStore = create<BookState>((set) => ({
  books: [],
  earningsData: [],
  loading: false,
  fetchBooks: async () => {
    const res = await api.get('/books');
    set({ books: res.data.data });
  },
  fetchEarnings: async () => {
    try {
      // Hits the new endpoint we are about to create in the controller
      const res = await api.get('/books/stats/earnings');
      set({ earningsData: res.data.data });
    } catch (error) {
      console.error("Failed to fetch earnings:", error);
    }
  },
  uploadBook: async (formData: FormData) => {
    set({ loading: true });
    try {
      await api.post('/books', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const res = await api.get('/books');
      set({ books: res.data.data, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  }
}));