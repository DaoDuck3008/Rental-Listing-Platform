import { create } from "zustand";

interface User {
  id: string;
  full_name: string;
  email: string;
  avatar?: string;
  role: string;
}
interface AuthState {
  access_token: string | null;
  user: User | null;
  hydrated: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  access_token: null,
  user: null,
  hydrated: false,

  setAuth: (token, user) =>
    set({
      access_token: token,
      user,
    }),

  clearAuth: () =>
    set({
      access_token: null,
      user: null,
    }),

  setHydrated: () => set({ hydrated: true }),
}));
