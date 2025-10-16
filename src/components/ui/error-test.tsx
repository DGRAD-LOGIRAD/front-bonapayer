import { Button } from '@/components/ui/button';
import { useErrorHandler } from '@/utils/error-handler';
import { useNavigate } from 'react-router-dom';

export function ErrorTest() {
  const navigate = useNavigate();
  const { handleError } = useErrorHandler(navigate);

  const simulate500Error = () => {
    const error = {
      status: 500,
      message: 'Internal Server Error',
      code: 'INTERNAL_SERVER_ERROR',
    };
    handleError(error);
  };

  const simulate404Error = () => {
    const error = {
      status: 404,
      message: 'Not Found',
      code: 'NOT_FOUND',
    };
    handleError(error);
  };

  const simulate401Error = () => {
    const error = {
      status: 401,
      message: 'Unauthorized',
      code: 'UNAUTHORIZED',
    };
    handleError(error);
  };

  if (import.meta.env.PROD) {
    return null; // Ne pas afficher en production
  }

  return (
    <div className='fixed bottom-4 right-4 z-50 space-y-2'>
      <div className='bg-white border rounded-lg p-3 shadow-lg'>
        <h4 className='text-sm font-medium mb-2'>Test d'erreurs</h4>
        <div className='space-y-1'>
          <Button
            size='sm'
            variant='destructive'
            onClick={simulate500Error}
            className='w-full text-xs'
          >
            Test 500
          </Button>
          <Button
            size='sm'
            variant='outline'
            onClick={simulate404Error}
            className='w-full text-xs'
          >
            Test 404
          </Button>
          <Button
            size='sm'
            variant='outline'
            onClick={simulate401Error}
            className='w-full text-xs'
          >
            Test 401
          </Button>
        </div>
      </div>
    </div>
  );
}
