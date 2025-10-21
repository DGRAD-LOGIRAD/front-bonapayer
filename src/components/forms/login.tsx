/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ChangePasswordModal from '../modal/ChangePasswordModal';
import { useAuthStore } from '@/stores/useAuthStore';
import axios from 'axios';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorFields, setErrorFields] = useState<{
    username?: string;
    password?: string;
    global?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, setShowChangePasswordModal } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorFields({});
    setLoading(true);

    const url = `/api-utilisateur/v1/authentification`;

    try {
      const res = await axios.post(
        url,
        { login: username, password },
        { validateStatus: () => true }
      );

      const data = res.data;

      if (data.status === '200' || data.status === '300') {
        const userData = data.content;

        login({
          id: userData.id,
          nom: userData.nom,
          postnom: userData.postnom,
          login: userData.login,
          mail: userData.mail,
          telephone: userData.telephone,
          sexe: userData.sexe,
          matricule: userData.matricule,
          dateNaissance: userData.dateNaissance,
          listDroit: userData.listDroit || [],
          token: userData.token,
          status: data.status,
          password: password,
        });

        localStorage.setItem('authToken', userData.token);

        navigate('/dashboard');

        if (userData.changePassword) {
          setTimeout(() => setShowChangePasswordModal(true), 300);
        }
      } else if (data.status === '400') {
        setErrorFields({
          global: data.message || 'Login ou mot de passe incorrect',
        });
      } else {
        setErrorFields({
          global: data.message || 'Erreur inattendue, veuillez réessayer.',
        });
      }
    } catch (err) {
      setErrorFields({
        global: 'Erreur réseau, veuillez réessayer.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className='bg-white shadow-2xl'>
      <CardContent className='p-8 space-y-6'>
        <p className='text-gray-700 text-center'>
          Veuillez vous connecter ci-dessous pour accéder à votre compte.
        </p>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <div
              className={`flex gap-0 border rounded-md overflow-hidden focus-within:ring-2 ${
                errorFields.username ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <Input
                type='text'
                value={username}
                onChange={e => setUsername(e.target.value)}
                className='flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none'
                placeholder="Nom d'utilisateur"
              />
              <div className='bg-gray-100 px-4 flex items-center border-l border-gray-300'>
                <span className='text-gray-600 text-sm'>@logirad.cd</span>
              </div>
            </div>
            {errorFields.username && (
              <p className='text-red-500 text-sm mt-1'>
                {errorFields.username}
              </p>
            )}
          </div>

          <div>
            <div
              className={`border rounded-md ${
                errorFields.password ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <Input
                type='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder='••••••'
                className='border-gray-300'
              />
            </div>
            {errorFields.password && (
              <p className='text-red-500 text-sm mt-1'>
                {errorFields.password}
              </p>
            )}
          </div>

          <Button
            type='submit'
            disabled={loading}
            className='w-full bg-primary hover:bg-blue-700 text-white font-semibold py-6 text-base flex justify-center items-center'
          >
            {loading ? (
              <>
                <Loader2 className='mr-2 h-5 w-5 animate-spin' /> Connexion...
              </>
            ) : (
              <>
                <ArrowRight className='mr-2 h-5 w-5' />
                SE CONNECTER
              </>
            )}
          </Button>
        </form>

        <div className='text-center'>
          <Link
            to='/auth/forgot-password'
            className='text-primary hover:text-blue-700 text-sm inline-flex items-center gap-1'
          >
            <span className='text-blue-400'>ⓘ</span>
            Cliquer ici si vous avez oublié votre mot de passe ?
          </Link>
        </div>

        {errorFields.global && (
          <div
            className='bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm flex items-center gap-2 transition-all duration-300 animate-fadeIn'
            role='alert'
          >
            <AlertCircle className='h-5 w-5 text-red-500' />
            <span>{errorFields.global}</span>
          </div>
        )}
      </CardContent>

      <ChangePasswordModal />
    </Card>
  );
}
