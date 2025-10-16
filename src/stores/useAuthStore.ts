import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  nom: string;
  postnom: string;
  login: string;
  mail: string;
  telephone?: string;
  sexe?: string;
  matricule?: string;
  dateNaissance?: string;
  listDroit?: any[];
  token: string;
  changePassword?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  showChangePasswordModal: boolean;
  login: (user: User) => void;
  logout: () => void;
  setShowChangePasswordModal: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      showChangePasswordModal: false,
      login: (user: User) => {
        set({
          user,
          isAuthenticated: true,
          showChangePasswordModal: user.changePassword ?? false,
        });
      },
      logout: () => set({ user: null, isAuthenticated: false, showChangePasswordModal: false }),
      setShowChangePasswordModal: (value) => set({ showChangePasswordModal: value }),
    }),
    {
      name: "auth-storage",
    }
  )
);
