'use client';

import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
  ADMIN_MENU,
  ICONS,
  USER_MENU,
  type SidebarMenuItem as SidebarMenuItemType,
} from '@/lib/constants';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import Logout from '@/components/forms/logout';

interface DashboardSidebarProps {
  userRole?: 'admin' | 'user';
}

export function DashboardSidebar({
  userRole = 'admin',
}: DashboardSidebarProps) {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const menuItems = (
    userRole === 'admin' ? ADMIN_MENU : USER_MENU
  ) as SidebarMenuItemType[];

  const hasSubItems = (
    item: SidebarMenuItemType
  ): item is SidebarMenuItemType & {
    items: SidebarMenuItemType[];
  } => Array.isArray(item.items) && item.items.length > 0;

  const isActive = useCallback(
    (href: string) => href !== '#' && location.pathname === href,
    [location.pathname]
  );

  const hasActiveSubItem = useCallback(
    (items: SidebarMenuItemType[]) =>
      items.some(subItem => isActive(subItem.href)),
    [isActive]
  );

  useEffect(() => {
    const activeParents = menuItems
      .filter(item => hasSubItems(item) && hasActiveSubItem(item.items))
      .map(item => item.label);

    setExpandedItems(activeParents);
  }, [location.pathname, menuItems, hasActiveSubItem]);

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isParentActive = (item: SidebarMenuItemType) =>
    hasSubItems(item) ? false : isActive(item.href);

  return (
    <Sidebar className='bg-primary text-primary-foreground'>
      <SidebarHeader className='border-b border-primary-foreground/20'>
        <div className='flex items-center gap-3 px-3 py-4'>
          <img
            src='/dgrad-logo-white.png'
            alt='Logo DGRAD'
            className='h-16 w-auto object-contain'
          />
          <div className='flex flex-col'>
            <span className='text-sm font-bold'>
              Gestion des bons à payer | DGRAD
            </span>
            <span className='text-xs text-primary-foreground/70 capitalize'>
              {userRole === 'admin' ? 'Administrateur' : 'Utilisateur'}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className='text-primary-foreground/70 font-semibold'>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => {
                const Icon = item.icon;
                const isItemActive = isParentActive(item);
                const subItems = hasSubItems(item) ? item.items : [];
                const isExpanded = expandedItems.includes(item.label);
                const hasChildren = subItems.length > 0;
                const hasActiveSub = hasChildren && hasActiveSubItem(subItems);

                return (
                  <SidebarMenuItem key={item.label}>
                    {hasChildren ? (
                      <>
                        <SidebarMenuButton
                          onClick={() => toggleExpanded(item.label)}
                          className={cn(
                            'w-full justify-between transition-all duration-200 text-primary-foreground/90 hover:bg-primary-foreground/10 hover:text-primary-foreground',
                            hasActiveSub &&
                              'bg-primary-foreground/10 text-primary-foreground'
                          )}
                        >
                          <div className='flex items-center gap-3'>
                            <Icon className='h-4 w-4' />
                            <span className='font-medium'>{item.label}</span>
                          </div>
                          <div className='transition-transform duration-200'>
                            {isExpanded ? (
                              <ICONS.ChevronDown className='h-4 w-4' />
                            ) : (
                              <ICONS.ChevronRight className='h-4 w-4' />
                            )}
                          </div>
                        </SidebarMenuButton>
                        {isExpanded && (
                          <SidebarMenuSub className='border-l border-primary-foreground/20'>
                            {subItems.map(subItem => {
                              const SubIcon = subItem.icon;
                              const isSubActive = isActive(subItem.href);

                              return (
                                <SidebarMenuSubItem key={subItem.label}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={isSubActive}
                                    className='transition-all duration-200 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground data-[active=true]:bg-primary-foreground/15 data-[active=true]:text-primary-foreground'
                                  >
                                    <Link
                                      to={subItem.href}
                                      className='flex items-center gap-3'
                                    >
                                      <SubIcon className='h-4 w-4' />
                                      <span className='font-medium'>
                                        {subItem.label}
                                      </span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        )}
                      </>
                    ) : (
                      <SidebarMenuButton
                        asChild
                        isActive={isItemActive}
                        className='transition-all duration-200 text-primary-foreground/90 hover:bg-primary-foreground/10 hover:text-primary-foreground data-[active=true]:bg-primary-foreground/15 data-[active=true]:text-primary-foreground data-[active=true]:border data-[active=true]:border-primary-foreground/20'
                      >
                        <Link
                          to={item.href}
                          className='flex items-center gap-3'
                        >
                          <Icon className='h-4 w-4' />
                          <span className='font-medium'>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className='border-t border-primary-foreground/20'>
        <SidebarSeparator className='border-primary-foreground/10' />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className='w-full justify-start text-primary-foreground/70 hover:text-destructive hover:bg-destructive/20 transition-all duration-200'
              asChild
            >
              <Logout />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
