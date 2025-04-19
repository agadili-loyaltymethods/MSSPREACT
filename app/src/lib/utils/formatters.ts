import { format } from 'date-fns';

export const formatters = {
  formatPhone: (value: number): string => {
    return value.toString().replace(/(\d{1})(\d{2})(\d{2})(\d{3})/, '0$1-$2-$3-$4');
  },

  formatAMPM: (value: string): string => {
    const [hours, minutes] = value.split(':');
    const numHours = Number(hours);
    if (numHours >= 12) {
      return `${String(numHours - 12 || 12).padStart(2, '0')}:${minutes}PM`;
    }
    return `${value}AM`;
  },

  formatMinutesToHours: (value: number): string => {
    const hours = Math.floor(value / 60);
    const minutes = Math.floor(value % 60);
    return `${hours}h ${minutes}m`;
  },

  formatCurrency: (
    value: number,
    currency: string = 'USD',
    options: Intl.NumberFormatOptions = {}
  ): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      ...options,
    }).format(value);
  },

  formatNumber: (value: number): string => {
    return new Intl.NumberFormat('en-US').format(value);
  },

  checkExpiry: (value: Date | string): string => {
    const date = new Date(value);
    if (date.getFullYear() > 2900) {
      return 'Never';
    }
    return format(date, 'dd/MM/yyyy');
  },
};