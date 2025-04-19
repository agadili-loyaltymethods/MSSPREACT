import { useMemo } from 'react';
import api from '@/lib/axios';

export function useActivityService() {
  const getActivity = async (payload?: any) => {
    const response = await api.post('/activity', payload);
    return response.data;
  };

  return useMemo(() => ({
    getActivity,
  }), []);
}