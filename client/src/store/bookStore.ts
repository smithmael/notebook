import { create } from 'zustand';
import api from '../api/axios'; // Your axios instance with interceptors

interface BookState {
  books: any[];
  loading: boolean;
  uploadBook: (formData: FormData) => Promise<void>;
  fetchBooks: () => Promise<void>;
}

export const useBookStore = create<BookState>((set) => ({
  books: [],
  loading: false,
  fetchBooks: async () => {
    const res = await api.get('/books');
    set({ books: res.data.data });
  },
  uploadBook: async (formData: FormData) => {
    set({ loading: true });
    try {
      // REAL TRICK: No JSON.stringify here. Send raw FormData.
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