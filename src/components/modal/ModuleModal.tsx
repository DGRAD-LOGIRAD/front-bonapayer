'use client';

import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Button } from '../ui/button';
import { useModalStore } from '@/stores/useModalStore';
import { useUserStore } from '@/stores/useUserStore';
import { useAuthStore } from '@/stores';
import { Input } from '../ui/input';

// interface Modul {
//   id: number;
//   intitule: string;
//}

interface ApiError {
  message?: string;
}

export default function ModuleModal() {
  // 🔹 Contrôle du modal via Zustand
  const showModal = useModalStore(state => state.showModuleModal);
  const setShowModal = useModalStore(state => state.setShowModuleModal);

  const { fetchUsers } = useUserStore(); // utilisé pour recharger la liste
  const { user } = useAuthStore();

  const [intitule, setIntitule] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  if (!showModal) return null;

  const handleSave = async (): Promise<void> => {
    setErrors({});

    if (!intitule.trim()) {
      setErrors({ intitule: "L'intitulé est obligatoire" });
      return;
    }

    const data = {
      intitule,
      fkUtilisateurCreat: user?.id,
    };

    setLoading(true);

    try {
      //alert(user?.id)
      await axios.post(`/api-utilisateur/v1/saveModule`, data, {
        headers: { Authorization: 'Bearer 123' },
      });

      alert('✅ Module ajouté avec succès !');
      setIntitule('');
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      const backendMessage =
        err.response?.data?.message || 'Erreur lors de l’ajout du module';
      setErrors({ backend: backendMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/30 flex justify-center items-center z-[1000]'>
      <div className='bg-white w-11/12 max-w-lg rounded-2xl shadow-xl p-6 relative z-[1001]'>
        <h2 className='text-2xl font-bold mb-4 text-center text-primary'>
          Ajouter un Module
        </h2>

        {errors.backend && (
          <p className='text-red-500 mb-2 text-center'>{errors.backend}</p>
        )}

        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1'>
            Intitulé du module <span className='text-red-500'>*</span>
          </label>
          <Input
            type='text'
            value={intitule}
            onChange={e => setIntitule(e.target.value)}
            placeholder='Ex : PARAMÉTRAGE UTILISATEUR'
            className={`w-full border rounded-md p-2 focus:ring-2 ${
              errors.intitule
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.intitule && (
            <p className='text-red-500 text-sm mt-1'>{errors.intitule}</p>
          )}
        </div>

        <div className='flex justify-end gap-3 mt-6'>
          <button
            onClick={() => setShowModal(false)}
            className='bg-border  text-gray-800 px-4 py-2 rounded-md'
          >
            Annuler
          </button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className='bg-primary  text-white px-4 py-2 rounded-md'
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </div>
    </div>
  );
}
