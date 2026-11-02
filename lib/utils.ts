import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Multi-currency formatter
export const EXCHANGE_RATES: Record<string, { symbol: string; rate: number; prefix: boolean }> = {
  BDT: { symbol: '৳', rate: 1, prefix: true },
  USD: { symbol: '$', rate: 0.0084, prefix: true },
  GBP: { symbol: '£', rate: 0.0066, prefix: true },
  AED: { symbol: 'AED ', rate: 0.031, prefix: true },
  EUR: { symbol: '€', rate: 0.0078, prefix: true },
};

export function formatPrice(amountInBDT: number, currency = 'BDT'): string {
  const config = EXCHANGE_RATES[currency] || EXCHANGE_RATES.BDT;
  const converted = Math.round(amountInBDT * config.rate);
  const formattedNumber = converted.toLocaleString('en-US');

  if (config.prefix) {
    return `${config.symbol} ${formattedNumber}`;
  }
  return `${formattedNumber} ${config.symbol}`;
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getOrderStatusBadge(status: string) {
  switch (status) {
    case 'PENDING':
      return { label: 'Staged & Pending', bg: 'bg-surface-container-high', text: 'text-on-surface-variant' };
    case 'CONFIRMED':
      return { label: 'Loom Allocated', bg: 'bg-secondary-fixed', text: 'text-on-secondary-fixed' };
    case 'PACKAGING':
      return { label: 'Heirloom Packaged', bg: 'bg-secondary-container', text: 'text-on-secondary-container' };
    case 'SHIPPED':
      return { label: 'Chauffeur In-Transit', bg: 'bg-secondary text-on-secondary', text: 'text-on-secondary font-bold' };
    case 'DELIVERED':
      return { label: 'Delivered & Fitted', bg: 'bg-primary text-on-primary', text: 'text-on-primary font-bold' };
    case 'CANCELLED':
      return { label: 'Archived', bg: 'bg-error-container', text: 'text-on-error-container' };
    default:
      return { label: status, bg: 'bg-surface-container-high', text: 'text-on-surface' };
  }
}
