import { forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/useAuthStore';

const Logout = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, onClick, type, ...props }, ref) => {
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = event => {
    onClick?.(event);
    if (event.defaultPrevented) {
      return;
    }

    logout();
    navigate('/auth/login');
  };

  return (
    <button
      ref={ref}
      type={type ?? 'button'}
      className={cn(
        'flex w-full items-center gap-3 text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors',
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children ?? (
        <>
          <LogOut className='h-4 w-4' />
          <span>Se déconnecter</span>
        </>
      )}
    </button>
  );
});

Logout.displayName = 'Logout';

export default Logout;
