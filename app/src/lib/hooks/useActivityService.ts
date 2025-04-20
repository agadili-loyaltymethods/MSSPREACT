import { useMemo } from 'react';
import api from '@/lib/axios';
const API_BASE_URL = import.meta.env.VITE_REST_URL;
export function useActivityService() {
  const getActivity = async (payload?: any, persist: boolean = false) => {
    // const response = await api.post('/activity', payload);
    const response = await api.post(`${API_BASE_URL}/api/v1/activity?filter=data,error?persist=${persist}`, payload);
    return response.data;
  };

  return useMemo(() => ({
    getActivity,
  }), []);
}