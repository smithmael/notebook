//client/src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  userRole: 'ADMIN' | 'OWNER' | 'USER' | null; 
  _hasHydrated: boolean;
  setAuth: (token: string, role: 'ADMIN' | 'OWNER' | 'USER') => void;
  setHasHydrated: (state: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userRole: null,
      _hasHydrated: false,
      
      // ✅ Set both token and role (Role must be Uppercase)
      setAuth: (token, role) => set({ 
        token, 
        userRole: role 
      }),

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      logout: () => {
        set({ token: null, userRole: null });
        localStorage.removeItem('auth-storage');
        // Optional: Force a reload to clear all cached data
        window.location.href = '/login';
      },
    }),
    {
      name: 'auth-storage',
      // ✅ Handle Hydration (Reading from LocalStorage)
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);