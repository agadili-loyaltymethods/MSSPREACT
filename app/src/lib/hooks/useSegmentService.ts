
import { useMemo } from 'react';
import api from '@/lib/axios';

export function useSegmentService() {
  const getAllSegments = async (query: string) => {
    const response = await api.get(`/segments?query=${query}`);
    return response.data;
  };

  const getMemberSegments = async (limit: number, query: string) => {
    const response = await api.get(`/member-segments?limit=${limit}&query=${query}`);
    return response.data;
  };

  const deleteMemberSegment = async (id: string) => {
    const response = await api.delete(`/member-segments/${id}`);
    return response.data;
  };

  const addMemberSegment = async (memberId: string, segmentId: string) => {
    const response = await api.post('/member-segments', { memberId, segmentId });
    return response.data;
  };

  return useMemo(() => ({
    getAllSegments,
    getMemberSegments,
    deleteMemberSegment,
    addMemberSegment,
  }), []);
}
