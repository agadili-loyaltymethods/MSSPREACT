import { useMemo } from 'react';
import api from '@/lib/axios';

export function useMemberService() {
  const getMemberOffers = async (memberId: string, location: string) => {
    const response = await api.get(`/members/${memberId}/offers?location=${location}`);
    return response.data;
  };

  const refreshMember = async () => {
    const response = await api.get('/members/refresh');
    return response.data;
  };

  return useMemo(() => ({
    getMemberOffers,
    refreshMember,
  }), []);
}