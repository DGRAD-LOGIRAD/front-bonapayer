import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Users,
  Settings,
  UserCog,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

export type SidebarMenuItem = {
  label: string;
  icon: LucideIcon;
  href: string;
  items?: SidebarMenuItem[];
};

export const ADMIN_MENU: SidebarMenuItem[] = [
  {
    label: 'Tableau de bord',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    label: 'Bon à payer',
    icon: FileText,
    href: '#',
    items: [
      {
        label: 'Registre',
        icon: FileText,
        href: '/dashboard/bon-a-payers',
      },
      {
        label: 'Fractionner un bon à payer',
        icon: PlusCircle,
        href: '/dashboard/bon-a-payers/creer',
      },
    ],
  },
  {
    label: 'Utilisateurs',
    icon: Users,
    href: '/dashboard/utilisateurs',
  },
  {
    label: 'Paramètres',
    icon: Settings,
    href: '/dashboard/parametres',
  },
];

export const USER_MENU: SidebarMenuItem[] = [
  {
    label: 'Tableau de bord',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    label: 'Bon à payer',
    icon: FileText,
    href: '/dashboard/bon-a-payers',
  },
  {
    label: 'Profil',
    icon: UserCog,
    href: '/dashboard/profile',
  },
];

export const ICONS = {
  ChevronDown,
  ChevronRight,
};
