import { create } from 'zustand';

interface AuthStore {
  isAuthenticated: boolean;
  user: null | { id: string; name: string; email: string };
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,

  login: async (email: string, password: string) => {
    // Mock authentication logic
    // Replace with real API call in production
    if (email && password) {
      set({ isAuthenticated: true, user: { id: '1', name: 'User', email } });
    } else {
      // Handle login error (optional)
      set({ isAuthenticated: false, user: null });
    }
  },

  signup: async (name: string, email: string, password: string) => {
    // Mock signup logic
    // Replace with real API call in production
    if (name && email && password) {
      set({ isAuthenticated: true, user: { id: '1', name, email } });
    } else {
      // Handle signup error (optional)
      set({ isAuthenticated: false, user: null });
    }
  },

  logout: () => {
    set({ isAuthenticated: false, user: null });
  },
}));