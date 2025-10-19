import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  nom: string;
  postnom: string;
  login: string;
  mail: string;
  telephone: string;
  sexe: string;
  matricule: string;
  dateNaissance: string;
  listDroit: string[];
  token: string;
  status: string;
  password: string;
}

interface AuthStore {
  user: User | null;
  showChangePasswordModal: boolean;
  passwordModalShown: boolean;
  login: (userData: User) => void;
  logout: () => void;
  setShowChangePasswordModal: (show: boolean) => void;
  updateUserStatus: (status: string) => void;
  setPasswordModalShown: (shown: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      user: null,
      showChangePasswordModal: false,
      passwordModalShown: false,
      login: userData => set({ user: userData }),
      logout: () =>
        set({
          user: null,
          showChangePasswordModal: false,
          passwordModalShown: false,
        }),
      setShowChangePasswordModal: show =>
        set({ showChangePasswordModal: show }),
      updateUserStatus: status =>
        set(state => ({
          user: state.user ? { ...state.user, status } : null,
        })),
      setPasswordModalShown: shown => set({ passwordModalShown: shown }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
