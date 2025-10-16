import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

function ServerErrorPage() {
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='flex justify-center mb-4'>
            <div className='p-3 bg-red-100 rounded-full'>
              <AlertTriangle className='h-12 w-12 text-red-600' />
            </div>
          </div>
          <CardTitle className='text-2xl font-bold text-gray-900'>
            Erreur 500
          </CardTitle>
          <CardDescription className='text-gray-600'>
            Une erreur interne du serveur s'est produite
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-4'>
          <div className='text-center text-sm text-gray-500'>
            <p>
              Le serveur rencontre actuellement des difficultés techniques.
              Veuillez réessayer dans quelques instants.
            </p>
          </div>

          <div className='space-y-2'>
            <Button
              onClick={handleRefresh}
              className='w-full'
              variant='default'
            >
              <RefreshCw className='h-4 w-4 mr-2' />
              Réessayer
            </Button>

            <div className='grid grid-cols-2 gap-2'>
              <Button
                onClick={handleGoBack}
                variant='outline'
                className='w-full'
              >
                <ArrowLeft className='h-4 w-4 mr-2' />
                Retour
              </Button>

              <Button
                onClick={handleGoHome}
                variant='outline'
                className='w-full'
              >
                <Home className='h-4 w-4 mr-2' />
                Accueil
              </Button>
            </div>
          </div>

          <div className='pt-4 border-t border-gray-200'>
            <div className='text-xs text-gray-400 text-center'>
              <p>Si le problème persiste, contactez le support technique.</p>
              <p className='mt-1'>
                Code d'erreur: <span className='font-mono'>500</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ServerErrorPage;
