/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from 'zustand';
import axios from 'axios';

interface Droit {
  id: number;
  module: string;
  codeDroit: string;
  intitule: string;
}

interface Module {
  id: number;
  intitule: string;
  etat: number;
  listDroit: Droit[];
  dateCreat: string;
  fkUtilisateurCreat: number;
}

interface ModuleStore {
  modules: Module[];
  loading: boolean;
  fetchModules: () => Promise<void>;
  addModule: (newModule: Module) => void;
  clearModules: () => void;
}

export const useModuleStore = create<ModuleStore>(set => ({
  modules: [],
  loading: false,

  fetchModules: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`/api-utilisateur/v1/getModule/*`, {
        headers: { Authorization: 'Bearer 123' },
      });

      if (res.data.status !== '200') {
        set({ modules: [] });
        return;
      }

      const modules = Array.isArray(res.data.listModule)
        ? res.data.listModule.map((m: Record<string, unknown>) => ({
            id: m.id,
            intitule: m.intitule,
            etat: m.etat,
            dateCreat: m.dateCreat,
            fkUtilisateurCreat: m.fkUtilisateurCreat,
            listDroit: Array.isArray(m.listDroit)
              ? m.listDroit
                  .map((droitStr: string) => {
                    try {
                      return JSON.parse(droitStr);
                    } catch {
                      return null;
                    }
                  })
                  .filter(Boolean)
              : [],
          }))
        : [];

      set({ modules });
    } catch (err: unknown) {
      set({ modules: [] });
    } finally {
      set({ loading: false });
    }
  },

  addModule: newModule =>
    set(state => ({ modules: [newModule, ...state.modules] })),

  clearModules: () => set({ modules: [] }),
}));
