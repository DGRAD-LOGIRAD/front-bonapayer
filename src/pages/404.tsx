import { Link } from 'react-router-dom';
import { Home, ArrowLeft, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

function NotFoundPage() {
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md text-center'>
        <CardHeader>
          <div className='mx-auto mb-4 p-3 bg-orange-100 rounded-full w-fit'>
            <AlertTriangle className='h-8 w-8 text-orange-600' />
          </div>
          <CardTitle className='text-2xl font-bold text-gray-900'>
            Page non trouvée
          </CardTitle>
          <CardDescription className='text-gray-600'>
            La page que vous recherchez n'existe pas ou a été déplacée.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='text-6xl font-bold text-gray-300'>404</div>

          <div className='space-y-2'>
            <p className='text-sm text-gray-500'>
              Vérifiez l'URL ou utilisez les liens ci-dessous pour naviguer.
            </p>
          </div>

          <div className='flex flex-col gap-2 pt-4'>
            <Button asChild className='w-full'>
              <Link to='/dashboard'>
                <Home className='mr-2 h-4 w-4' />
                Retour au tableau de bord
              </Link>
            </Button>

            <Button variant='outline' asChild className='w-full'>
              <Link to='/dashboard/bon-a-payers'>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Voir les bons à payer
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default NotFoundPage;
