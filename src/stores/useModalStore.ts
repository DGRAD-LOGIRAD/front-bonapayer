import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  showUserModal: boolean;
  setShowUserModal: (show: boolean) => void;
}

export const useModalStore = create<AuthStore>()(
  persist(
    set => ({
      showUserModal: false,
      setShowUserModal: (show: boolean) => set({ showUserModal: show }),
    }),
    { name: 'modal-storage' }
  )
);
