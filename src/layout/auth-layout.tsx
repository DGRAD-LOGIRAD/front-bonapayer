import { Outlet } from 'react-router-dom';
import dgradLogo from '@/assets/dgrad-logo.png';

function AuthLayout() {
  return (
    <div className='h-screen flex flex-col bg-gradient-to-br from-blue-900 to-primary'>
      <main className='flex-1 flex items-center justify-center p-4 overflow-hidden'>
        <div className='w-full max-w-7xl grid lg:grid-cols-2 gap-8 items-center'>
          <div className='text-white space-y-6'>
            <div className='flex flex-col items-center lg:items-start space-y-4'>
              <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-2xl'>
                <img
                  src={dgradLogo}
                  alt='Logo DGRAD'
                  className='h-24 w-auto mx-auto'
                />
              </div>

              <div className='text-center lg:text-left space-y-3'>
                <h1 className='text-3xl lg:text-4xl font-bold tracking-wide'>
                  Gestion des bons à payer
                </h1>
                <h2 className='text-xl lg:text-2xl font-semibold text-blue-100'>
                  LOGIRAD
                </h2>
                <div className='w-20 h-1 bg-white mx-auto lg:mx-0 rounded-full'></div>
              </div>
            </div>

            <div className='space-y-3 text-base lg:text-lg'>
              <p className='font-medium text-blue-50'>
                Plateforme de gestion des bons à payer de la DGRAD
              </p>
              <p className='text-blue-100'>
                Gestion numérique des bons à payer
              </p>
            </div>

            <div className='bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10'>
              <p className='text-xs text-blue-200 font-medium'>
                ENVIRONNEMENT - DÉVELOPPEMENT
              </p>
            </div>
          </div>

          <div className='flex justify-center lg:justify-end'>
            <Outlet />
          </div>
        </div>
      </main>

      <footer className='bg-black py-3 border-t border-white/10'>
        <div className='text-center text-white text-sm'>
          <p>© {new Date().getFullYear()} DGRAD - Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
}

export default AuthLayout;
