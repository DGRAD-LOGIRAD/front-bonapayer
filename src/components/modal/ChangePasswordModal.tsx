'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button } from '../ui/button';
import axios from 'axios';

const ChangePasswordModal: React.FC = () => {
  const { showChangePasswordModal, setShowChangePasswordModal, user } =
    useAuthStore();
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (!showChangePasswordModal) return null;

  const handleValidate = async () => {
    setError('');
    setSuccess('');

    if (!user) {
      setError('Utilisateur non authentifié.');
      return;
    }

    if (newPassword.trim().length < 3) {
      setError('Le mot de passe doit contenir au moins 3 caractères.');
      return;
    }

    if (newPassword !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);

    try {
      const url = `/api-utilisateur/v1/newPassword`;

      const res = await axios.post(
        url,
        {
          holdPassword: user.password,
          newPassword: newPassword,
          id: user.id,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
          validateStatus: () => true,
        }
      );

      const body = res.data;

      if (body.status === '200') {
        setError(
          body.message ||
            body.description_erreur ||
            'Erreur lors du changement de mot de passe.'
        );
      } else if (body.status === '201') {
        setSuccess(body.message || 'Mot de passe modifié avec succès ✅');
        setNewPassword('');
        setConfirm('');

        setTimeout(() => {
          setShowChangePasswordModal(false);
          setSuccess('');
        }, 2000);
      } else {
        setError(
          body.message || body.description_erreur || 'Erreur inattendue.'
        );
      }
    } catch {
      setError('Erreur réseau, veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]'>
      <div className='bg-white p-6 rounded-2xl shadow-2xl w-[400px] relative'>
        <button
          className='absolute top-3 right-3 text-gray-400 hover:text-gray-600'
          onClick={() => setShowChangePasswordModal(false)}
        >
          ✖
        </button>

        <h2 className='text-xl font-semibold text-center mb-4 text-gray-700'>
          🔐 Changement de mot de passe
        </h2>

        <div className='space-y-3'>
          <div>
            <label className='block text-sm font-medium text-gray-600'>
              Nouveau mot de passe
            </label>
            <input
              type='password'
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className={`w-full border rounded p-2 mt-1 focus:ring-2 ${
                error
                  ? 'border-red-500 focus:ring-red-400'
                  : 'focus:ring-blue-400'
              }`}
              disabled={loading}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-600'>
              Confirmer le mot de passe
            </label>
            <input
              type='password'
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className={`w-full border rounded p-2 mt-1 focus:ring-2 ${
                error
                  ? 'border-red-500 focus:ring-red-400'
                  : 'focus:ring-blue-400'
              }`}
              disabled={loading}
            />
          </div>

          {error && (
            <div className='text-red-600 text-sm border border-red-300 bg-red-50 rounded-md p-2'>
              {error}
            </div>
          )}

          {success && (
            <div className='text-green-600 text-sm border border-green-300 bg-green-50 rounded-md p-2'>
              {success}
            </div>
          )}

          <div className='flex flex-col gap-2'>
            <Button
              onClick={handleValidate}
              disabled={loading}
              className='w-full mt-3 bg-primary text-white font-semibold py-2 rounded transition disabled:opacity-60'
            >
              {loading ? 'Enregistrement...' : 'Valider'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
