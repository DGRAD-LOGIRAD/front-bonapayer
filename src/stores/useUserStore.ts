import { create } from 'zustand';
import axios from 'axios';

interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  mail: string;
  etat: number;
  creation: string;
}

interface UserStore {
  users: Utilisateur[];
  loading: boolean;
  fetchUsers: () => Promise<void>;
  addUser: (newUser: Utilisateur) => void;
  clearUsers: () => void;
}

export const useUserStore = create<UserStore>(set => ({
  users: [],
  loading: false,

  fetchUsers: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`/api-utilisateur/v1/getAllUtilisateur`, {
        headers: { Authorization: 'Bearer 123' },
      });
      const content = Array.isArray(res.data?.content) ? res.data.content : [];
      const utilisateurs = content.map(
        (u: Record<string, unknown>, index: number) => ({
          id: Number(u.id ?? index),
          nom: String(u.nom ?? 'Inconnu'),
          prenom: String(u.prenom ?? ''),
          mail: String(u.mail ?? ''),
          etat: Number(u.etat ?? 0),
          creation: new Date().toISOString(),
        })
      );
      set({ users: utilisateurs });
    } catch (err) {
      console.error('Erreur chargement utilisateurs :', err);
    } finally {
      set({ loading: false });
    }
  },

  addUser: newUser => set(state => ({ users: [newUser, ...state.users] })),

  clearUsers: () => set({ users: [] }),
}));
