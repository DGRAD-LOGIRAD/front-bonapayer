// src/stores/auth.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
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
}

interface AuthState {
  user: User | null;
  showChangePasswordModal: boolean;
  passwordModalShown: boolean;
}

interface AuthActions {
  login: (userData: User) => void;
  logout: () => void;
  setShowChangePasswordModal: (show: boolean) => void;
  updateUserStatus: (status: string) => void;
  setPasswordModalShown: (shown: boolean) => void;
}

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      // --- State ---
      user: null,
      showChangePasswordModal: false,
      passwordModalShown: false,

      // --- Actions ---
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
        set(state =>
          state.user ? { user: { ...state.user, status } } : state
        ),

      setPasswordModalShown: shown => set({ passwordModalShown: shown }),
    }),
    {
      name: 'auth-storage',
      version: 1,

      // Sécurise SSR/Next.js : n’utilise localStorage que côté client
      storage:
        typeof window !== 'undefined'
          ? createJSONStorage(() => localStorage)
          : undefined,

      // Ne persister que ce qui est utile (évite d’enregistrer les flags UI)
      partialize: state => ({
        user: state.user,
      }),

      // (Optionnel) migration si vous changez la forme du state plus tard
      migrate: persistedState => {
        return persistedState as AuthStore;
      },
    }
  )
);

// Sélecteurs pratiques (optionnel)
export const selectUser = (s: AuthStore) => s.user;
export const selectToken = (s: AuthStore) => s.user?.token ?? null;
export const selectIsPasswordModalOpen = (s: AuthStore) =>
  s.showChangePasswordModal;
