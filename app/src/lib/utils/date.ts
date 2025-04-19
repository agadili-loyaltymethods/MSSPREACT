import { format, addLeadingZeros } from 'date-fns';

export const dateUtils = {
  getCurrentTimeWithZeroSeconds: (date: Date = new Date()) => {
    const d = new Date(date);
    d.setSeconds(0);
    d.setMilliseconds(0);
    return d;
  },

  formatDate: (d: Date) => {
    const month = d.getMonth() + 1;
    return `${d.getFullYear()}-${addLeadingZeros(month, 2)}-${addLeadingZeros(d.getDate(), 2)}`;
  },

  convertToMinutes: (hourMinutes: string): number => {
    const [hours, minutes] = hourMinutes.split(':');
    return Number(hours) * 60 + Number(minutes);
  },

  getHourMinutes: (d: Date): string => {
    return format(d, "HH:mm:ss.SSS'Z'");
  },
};