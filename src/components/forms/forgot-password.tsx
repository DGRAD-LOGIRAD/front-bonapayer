'use client';

import type React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ApiResponse {
  message: string;
  description_erreur?: string;
  status: string;
}

export function ForgotPasswordForm() {
  const [identifiant, setIdentifiant] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validation simple
    if (!identifiant.trim()) {
      setError('Veuillez saisir votre email ou login.');
      return;
    }

    try {
      setLoading(true);

      const response = await axios.put<ApiResponse>(
        `/api-utilisateur/v1/reinitPassword/${encodeURIComponent(identifiant)}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status === '201') {
        setMessage(response.data.message);
      } else {
        setError(
          response.data.description_erreur ||
            response.data.message ||
            'Une erreur est survenue.'
        );
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const res = err.response?.data as ApiResponse | undefined;
        setError(
          res?.description_erreur ||
            res?.message ||
            'Erreur de communication avec le serveur.'
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur inconnue est survenue.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className='bg-white shadow-2xl'>
      <CardContent className='p-8 space-y-6'>
        <div className='text-center space-y-2'>
          <h2 className='text-2xl font-bold text-gray-900'>
            Mot de passe oublié
          </h2>
          <p className='text-gray-600'>
            Entrez votre <strong>email</strong> ou votre <strong>login</strong>{' '}
            pour recevoir un nouveau mot de passe.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-700'>
              Email ou login
            </label>
            <Input
              type='text'
              value={identifiant}
              onChange={e => {
                setIdentifiant(e.target.value);
                if (error) setError('');
              }}
              placeholder='ex : utilisateur@logirad.cd ou jdupont'
              className={`border p-3 rounded-md w-full ${
                error
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
            {message && (
              <p className='text-green-600 text-sm mt-1'>{message}</p>
            )}
          </div>

          <Button
            type='submit'
            disabled={loading}
            className='w-full bg-primary hover:bg-blue-700 text-white font-semibold py-6 text-base'
          >
            {loading ? (
              'Envoi en cours...'
            ) : (
              <>
                <Mail className='mr-2 h-5 w-5' />
                ENVOYER LE MAIL
              </>
            )}
          </Button>
        </form>

        <div className='text-center'>
          <Link
            to='/auth/login'
            className='text-primary hover:text-blue-700 text-sm inline-flex items-center gap-1'
          >
            <ArrowLeft className='h-4 w-4' />
            Retour à la connexion
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
