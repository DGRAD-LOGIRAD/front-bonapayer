import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Forgot password attempt:', { email });
  };

  return (
    <Card className='bg-white shadow-2xl'>
      <CardContent className='p-8 space-y-6'>
        <div className='text-center space-y-2'>
          <h2 className='text-2xl font-bold text-gray-900'>
            Mot de passe oublié
          </h2>
          <p className='text-gray-600'>
            Entrez votre adresse email pour recevoir un lien de réinitialisation
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-700'>
              Adresse email
            </label>
            <Input
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder='votre.email@logirad.cd'
              className='border-gray-300'
              required
            />
          </div>

          <Button
            type='submit'
            className='w-full bg-primary hover:bg-blue-700 text-white font-semibold py-6 text-base'
          >
            <Mail className='mr-2 h-5 w-5' />
            ENVOYER LE LIEN
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
