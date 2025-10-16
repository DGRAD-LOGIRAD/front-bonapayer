'use client';

import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, User } from 'lucide-react';

import { DashboardSidebar } from '@/components/navigation/dashboard-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

const LABEL_OVERRIDES: Record<string, string> = {
  dashboard: 'Dashboard',
  'bon-a-payers': 'Bon à payer',
  creer: 'Fractionner',
  utilisateurs: 'Utilisateurs',
  parametres: 'Paramètres',
  profile: 'Profil',
};

function Breadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  const crumbs = segments.reduce<
    Array<{ label: string; href: string; isActive: boolean }>
  >((acc, segment, index) => {
    const href = `/${segments.slice(0, index + 1).join('/')}`;
    const isActive = index === segments.length - 1;
    const label =
      LABEL_OVERRIDES[segment] ??
      segment.charAt(0).toUpperCase() + segment.slice(1);

    acc.push({ label, href, isActive });
    return acc;
  }, []);

  if (!crumbs.length) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to='/dashboard' className='flex items-center gap-1'>
              <Home className='h-4 w-4' />
              Tableau de bord
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {crumbs
          .filter(crumb => crumb.href !== '/dashboard')
          .map(crumb => (
            <span key={crumb.href} className='flex items-center'>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {crumb.isActive ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function DashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardSidebar userRole='admin' />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 shadow-sm'>
          <SidebarTrigger className='-ml-1 hover:bg-primary/10 hover:text-primary transition-colors' />
          <div className='flex items-center gap-2 flex-1'>
            <div className='flex-1'>
              <Breadcrumbs />
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant='ghost'
                size='sm'
                className='text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors'
                asChild
              >
                <Link to='/dashboard/profile'>
                  <User className='h-4 w-4 mr-2' />
                  Profil
                </Link>
              </Button>
            </div>
          </div>
        </header>
        <main className='flex-1 p-6 bg-muted/30 min-h-[calc(100vh-4rem)]'>
          <div className='max-w-7xl mx-auto'>
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default DashboardLayout;
