import { clsx, type ClassValue } from 'clsx';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: 'USD' | 'CDF' = 'USD'
) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(amount);
}

export function formatDate(date: string | Date) {
  return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
}
