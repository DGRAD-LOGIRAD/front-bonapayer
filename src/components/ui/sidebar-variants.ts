import { cva, type VariantProps } from 'class-variance-authority';

export type SidebarVariants = VariantProps<typeof sidebarVariants>;
export type SidebarContainerVariants = VariantProps<
  typeof sidebarContainerVariants
>;
export type SidebarInnerVariants = VariantProps<typeof sidebarInnerVariants>;
export type SidebarGapVariants = VariantProps<typeof sidebarGapVariants>;

export const sidebarVariants = cva(
  'group peer text-sidebar-foreground hidden md:block',
  {
    variants: {
      side: {
        left: '',
        right: '',
      },
      variant: {
        sidebar: '',
        floating: '',
        inset: '',
      },
      collapsible: {
        offcanvas: '',
        icon: '',
        none: '',
      },
    },
    defaultVariants: {
      side: 'left',
      variant: 'sidebar',
      collapsible: 'offcanvas',
    },
  }
);

export const sidebarContainerVariants = cva(
  'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex',
  {
    variants: {
      side: {
        left: 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]',
        right:
          'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
      },
      variant: {
        sidebar:
          'group-data-[side=left]:border-r group-data-[side=right]:border-l',
        floating:
          'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]',
        inset:
          'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]',
      },
      collapsible: {
        offcanvas: '',
        icon: 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
        none: '',
      },
    },
    defaultVariants: {
      side: 'left',
      variant: 'sidebar',
      collapsible: 'offcanvas',
    },
  }
);

export const sidebarInnerVariants = cva(
  'bg-primary flex h-full w-full flex-col',
  {
    variants: {
      variant: {
        sidebar: '',
        floating:
          'group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:border-sidebar-border',
        inset: '',
      },
    },
    defaultVariants: {
      variant: 'sidebar',
    },
  }
);

export const sidebarGapVariants = cva(
  'relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear group-data-[collapsible=offcanvas]:w-0 group-data-[side=right]:rotate-180',
  {
    variants: {
      variant: {
        sidebar: 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
        floating:
          'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]',
        inset:
          'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]',
      },
    },
    defaultVariants: {
      variant: 'sidebar',
    },
  }
);
