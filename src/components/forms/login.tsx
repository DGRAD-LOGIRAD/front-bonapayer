import { useActionState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ChangePasswordModal from '../modal/ChangePasswordModal';
import { useAuthStore } from '@/stores/useAuthStore';
import axios from 'axios';

type LoginState = {
  errors: {
    username?: string;
    password?: string;
    global?: string;
  };
  success: boolean;
  userData?: unknown;
};

async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username?.trim()) {
    return {
      errors: { username: "Le nom d'utilisateur est requis" },
      success: false,
    };
  }

  if (!password?.trim()) {
    return {
      errors: { password: 'Le mot de passe est requis' },
      success: false,
    };
  }

  const url = `/api-utilisateur/v1/authentification`;

  try {
    const res = await axios.post(
      url,
      { login: username, password },
      { validateStatus: () => true }
    );

    const data = res.data;

    if (data.status === '200' || data.status === '300') {
      return {
        errors: {},
        success: true,
        userData: data,
      };
    } else if (data.status === '400') {
      return {
        errors: {
          global: data.message || 'Login ou mot de passe incorrect',
        },
        success: false,
      };
    } else {
      return {
        errors: {
          global: data.message || 'Erreur inattendue, veuillez réessayer.',
        },
        success: false,
      };
    }
  } catch {
    return {
      errors: {
        global: 'Erreur réseau, veuillez réessayer.',
      },
      success: false,
    };
  }
}

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, {
    errors: {},
    success: false,
  });

  const navigate = useNavigate();
  const { login, setShowChangePasswordModal } = useAuthStore();

  useEffect(() => {
    if (state.success && state.userData) {
      const data = state.userData as {
        status: string;
        content: {
          id: number;
          nom: string;
          postnom: string;
          login: string;
          mail: string;
          telephone: string;
          sexe: string;
          matricule: string;
          dateNaissance: string;
          listDroit: unknown[];
          token: string;
          changePassword?: boolean;
        };
      };

      const formData = new FormData(
        document.querySelector('form') as HTMLFormElement
      );
      const password = formData.get('password') as string;
      const userData = data.content;

      login({
        id: String(userData.id),
        nom: userData.nom,
        postnom: userData.postnom,
        login: userData.login,
        mail: userData.mail,
        telephone: userData.telephone,
        sexe: userData.sexe,
        matricule: userData.matricule,
        dateNaissance: userData.dateNaissance,
        listDroit: (userData.listDroit || []) as string[],
        token: userData.token,
        status: data.status,
        password: password,
      });

      localStorage.setItem('authToken', userData.token);

      navigate('/dashboard');

      if (userData.changePassword) {
        setTimeout(() => setShowChangePasswordModal(true), 300);
      }
    }
  }, [state.success, state.userData, navigate, login, setShowChangePasswordModal]);

  return (
    <Card className='bg-white shadow-2xl w-full border-0 rounded-xl sm:rounded-2xl'>
      <CardContent className='p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5 md:space-y-6'>
        <p className='text-gray-700 text-center text-sm sm:text-base'>
          Veuillez vous connecter ci-dessous pour accéder à votre compte.
        </p>

        <form action={formAction} className='space-y-3 sm:space-y-4'>
          <div>
            <div
              className={`flex gap-0 border rounded-md overflow-hidden focus-within:ring-2 ${state.errors.username ? 'border-red-500' : 'border-gray-300'
                }`}
            >
              <Input
                type='text'
                name='username'
                className='flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none text-sm sm:text-base'
                placeholder="Nom d'utilisateur"
                required
              />
              <div className='bg-gray-100 px-2 sm:px-4 flex items-center border-l border-gray-300'>
                <span className='text-gray-600 text-xs sm:text-sm whitespace-nowrap'>
                  @logirad.cd
                </span>
              </div>
            </div>
            {state.errors.username && (
              <p className='text-red-500 text-xs sm:text-sm mt-1'>
                {state.errors.username}
              </p>
            )}
          </div>

          <div>
            <div
              className={`border rounded-md ${state.errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
            >
              <Input
                type='password'
                name='password'
                placeholder='••••••'
                className='border-gray-300 text-sm sm:text-base'
                required
              />
            </div>
            {state.errors.password && (
              <p className='text-red-500 text-xs sm:text-sm mt-1'>
                {state.errors.password}
              </p>
            )}
          </div>

          <Button
            type='submit'
            disabled={isPending}
            className='w-full bg-primary hover:bg-blue-700 text-white font-semibold py-4 sm:py-5 md:py-6 text-sm sm:text-base flex justify-center items-center gap-2'
          >
            {isPending ? (
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

        {state.errors.global && (
          <div
            className='bg-red-50 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-md text-xs sm:text-sm flex items-start sm:items-center gap-2 transition-all duration-300 animate-fadeIn'
            role='alert'
          >
            <AlertCircle className='h-4 w-4 sm:h-5 sm:w-5 text-red-500 shrink-0 mt-0.5 sm:mt-0' />
            <span className='wrap-break-word'>{state.errors.global}</span>
          </div>
        )}
      </CardContent>

      <ChangePasswordModal />
    </Card>
  );
}
