import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FilterStore {
  search: string;
  etatFilter: string;
  setSearch: (value: string) => void;
  setEtatFilter: (value: string) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterStore>()(
  persist(
    set => ({
      search: '',
      etatFilter: 'tous',
      setSearch: value => set({ search: value }),
      setEtatFilter: value => set({ etatFilter: value }),
      resetFilters: () => set({ search: '', etatFilter: 'tous' }),
    }),
    { name: 'filter-storage' }
  )
);
