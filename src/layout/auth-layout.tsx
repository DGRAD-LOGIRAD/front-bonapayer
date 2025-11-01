import { Outlet } from 'react-router-dom';
import dgradLogo from '@/assets/dgrad-logo.png';

function AuthLayout() {
  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-br from-blue-900 via-blue-800 to-primary'>
      <main className='container flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8'>
        <div className='w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 xl:gap-16 items-center'>
          <div className='text-white space-y-6 hidden lg:flex lg:flex-col'>
            <div className='flex flex-col items-start space-y-6'>
              <div className='bg-white rounded-2xl p-4 sm:p-5 shadow-2xl'>
                <img
                  src={dgradLogo}
                  alt='Logo DGRAD'
                  className='h-20 sm:h-24 lg:h-28 w-auto'
                />
              </div>

              <div className='space-y-4'>
                <div>
                  <h1 className='text-2xl lg:text-3xl xl:text-4xl font-bold tracking-wide leading-tight'>
                    Gestion des bons à payer
                  </h1>
                  <h2 className='text-xl lg:text-2xl xl:text-2xl font-semibold text-blue-100 mt-2'>
                    LOGIRAD
                  </h2>
                  <div className='w-20 h-1 bg-white rounded-full mt-4'></div>
                </div>

                <div className='space-y-3 text-base lg:text-lg xl:text-xl pt-4'>
                  <p className='font-medium text-blue-50 leading-relaxed'>
                    Plateforme de gestion des bons à payer de la DGRAD
                  </p>
                  <p className='text-blue-100 leading-relaxed'>
                    Gestion numérique des bons à payer
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='w-full flex flex-col items-center justify-center'>
            <div className='lg:hidden text-white text-center space-y-4 sm:space-y-6 mb-6 sm:mb-8 w-full'>
              <div className='bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-2xl inline-block'>
                <img
                  src={dgradLogo}
                  alt='Logo DGRAD'
                  className='h-16 sm:h-20 w-auto'
                />
              </div>
              <div className='space-y-2 sm:space-y-3 px-4'>
                <h1 className='text-2xl sm:text-3xl font-bold tracking-wide leading-tight'>
                  Gestion des bons à payer
                </h1>
                <h2 className='text-lg sm:text-xl font-semibold text-blue-100'>
                  LOGIRAD
                </h2>
              </div>
            </div>

            <div className='w-full max-w-md'>
              <Outlet />
            </div>
          </div>
        </div>
      </main>

      <footer className='bg-black/50 backdrop-blur-sm py-3 sm:py-4 border-t border-white/10 mt-auto'>
        <div className='container mx-auto px-4'>
          <div className='text-center text-white text-xs sm:text-sm'>
            <p>© {new Date().getFullYear()} DGRAD - Tous droits réservés</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AuthLayout;
