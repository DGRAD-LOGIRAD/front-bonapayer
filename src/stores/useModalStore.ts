import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  showUserModal: boolean;
  setShowUserModal: (show: boolean) => void;

  showModuleModal: boolean;
  setShowModuleModal: (show: boolean) => void;
}

export const useModalStore = create<AuthStore>()(
  persist(
    set => ({
      showUserModal: false,
      showModuleModal: false,

      setShowUserModal: (show: boolean) => set({ showUserModal: show }),
      setShowModuleModal: (show: boolean) => set({ showModuleModal: show }),
    }),
    { name: 'modal-storage' }
  )
);
