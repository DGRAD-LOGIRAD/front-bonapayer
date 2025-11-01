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
    } catch {
      setErrorFields({
        global: 'Erreur réseau, veuillez réessayer.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className='bg-white shadow-2xl w-full border-0 rounded-xl sm:rounded-2xl'>
      <CardContent className='p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5 md:space-y-6'>
        <p className='text-gray-700 text-center text-sm sm:text-base'>
          Veuillez vous connecter ci-dessous pour accéder à votre compte.
        </p>

        <form onSubmit={handleSubmit} className='space-y-3 sm:space-y-4'>
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
                className='flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none text-sm sm:text-base'
                placeholder="Nom d'utilisateur"
              />
              <div className='bg-gray-100 px-2 sm:px-4 flex items-center border-l border-gray-300'>
                <span className='text-gray-600 text-xs sm:text-sm whitespace-nowrap'>
                  @logirad.cd
                </span>
              </div>
            </div>
            {errorFields.username && (
              <p className='text-red-500 text-xs sm:text-sm mt-1'>
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
                className='border-gray-300 text-sm sm:text-base'
              />
            </div>
            {errorFields.password && (
              <p className='text-red-500 text-xs sm:text-sm mt-1'>
                {errorFields.password}
              </p>
            )}
          </div>

          <Button
            type='submit'
            disabled={loading}
            className='w-full bg-primary hover:bg-blue-700 text-white font-semibold py-4 sm:py-5 md:py-6 text-sm sm:text-base flex justify-center items-center gap-2'
          >
            {loading ? (
              <>
                <Loader2 className='h-4 w-4 sm:h-5 sm:w-5 animate-spin' />
                <span>Connexion...</span>
              </>
            ) : (
              <>
                <ArrowRight className='h-4 w-4 sm:h-5 sm:w-5' />
                <span className='hidden sm:inline'>SE CONNECTER</span>
                <span className='sm:hidden'>CONNEXION</span>
              </>
            )}
          </Button>
        </form>

        <div className='text-center'>
          <Link
            to='/auth/forgot-password'
            className='text-primary hover:text-blue-700 text-xs sm:text-sm inline-flex items-center gap-1 flex-wrap justify-center'
          >
            <span className='text-blue-400'>ⓘ</span>
            <span className='text-center'>
              Cliquer ici si vous avez oublié votre mot de passe ?
            </span>
          </Link>
        </div>

        {errorFields.global && (
          <div
            className='bg-red-50 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-md text-xs sm:text-sm flex items-start sm:items-center gap-2 transition-all duration-300 animate-fadeIn'
            role='alert'
          >
            <AlertCircle className='h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0 mt-0.5 sm:mt-0' />
            <span className='break-words'>{errorFields.global}</span>
          </div>
        )}
      </CardContent>

      <ChangePasswordModal />
    </Card>
  );
}
