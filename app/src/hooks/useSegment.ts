import { useCallback } from 'react';
import axios from 'axios';
import { Segment } from '../models/segment';

const API_BASE_URL = import.meta.env.VITE_REST_URL;

export const useSegment = () => {
  const getAllSegments = useCallback(async (query: string = '', limit: number = 10): Promise<Segment[]> => {
    const response = await axios.get<Segment[]>(`${API_BASE_URL}/api/v1/segments`, {
      params: {
        limit,
        query
      }
    });
    return response.data;
  }, []);

  const getMemberSegments = useCallback(async (limit: number = 10, query: string): Promise<Segment[]> => {
    const response = await axios.get<Segment[]>(`${API_BASE_URL}/api/v1/membersegments`, {
      params: {
        limit,
        query
      }
    });
    return response.data;
  }, []);

  const addMemberSegment = useCallback(async (memberId: string, segmentId: string) => {
    const payload = {
      member: memberId,
      segment: segmentId,
      ext: {}
    };
    
    const response = await axios.post(`${API_BASE_URL}/api/v1/membersegments`, payload);
    return response.data;
  }, []);

  const deleteMemberSegment = useCallback(async (id: string) => {
    const response = await axios.delete(`${API_BASE_URL}/api/v1/membersegments/${id}`);
    return response.data;
  }, []);

  return {
    getAllSegments,
    getMemberSegments,
    addMemberSegment,
    deleteMemberSegment
  };
};