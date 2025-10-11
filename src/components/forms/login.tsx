import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LoginForm() {
  const [username, setUsername] = useState('patrick.mwira');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Login attempt:', { username, password });
  };

  return (
    <Card className='bg-white shadow-2xl'>
      <CardContent className='p-8 space-y-6'>
        <p className='text-gray-700 text-center'>
          Veuillez vous connecter ci-dessous pour accéder à votre compte.
        </p>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='flex gap-0 border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500'>
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

          <Input
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder='•••'
            className='border-gray-300'
          />

          <Button
            type='submit'
            className='w-full bg-primary hover:bg-blue-700 text-white font-semibold py-6 text-base'
          >
            <ArrowRight className='mr-2 h-5 w-5' />
            SE CONNECTER
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
      </CardContent>
    </Card>
  );
}
