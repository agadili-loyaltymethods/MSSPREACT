import { useCallback, useState } from 'react';
import axios from 'axios';
import { Coupon } from '../models/coupon';
import { CouponList } from '../models/coupon-list';
import useSWR from 'swr';

const API_BASE_URL = import.meta.env.VITE_REST_URL;

export const useActivity = () => {
  const [streakCache, setStreakCache] = useState<any>(null);

  const getPerks = useCallback(async (): Promise<Coupon[]> => {
    const response = await axios.get<Coupon[]>(`${API_BASE_URL}/rewardPolicy`);
    return response.data;
  }, []);

  const getCoupons = useCallback(async (): Promise<Coupon[]> => {
    const response = await axios.get<Coupon[]>(`${API_BASE_URL}/rewardPolicies`);
    return response.data;
  }, []);

  const getCouponList = useCallback(async (id: string): Promise<CouponList[]> => {
    const response = await axios.get<CouponList[]>(`${API_BASE_URL}/rewards`, {
      params: { query: id }
    });
    return response.data;
  }, []);

  const getActivity = useCallback(async (payload: any, persist = false) => {
    const defaultValues = {
      srcChannelType: 'Web',
      loyaltyID: localStorage.getItem('loyaltyId')
    };

    const url = `${API_BASE_URL}/api/v1/activity?filter=data,error?persist=${persist}`;

    if (Array.isArray(payload)) {
      // Handle multiple activities
      const promises = payload.map(item =>
        axios.post(url, { ...item, ...defaultValues })
      );
      return Promise.all(promises);
    } else {
      // Single activity request
      return axios.post(url, { ...payload, ...defaultValues });
    }
  }, []);

  // Using SWR for streak policy caching
  const { data: streakPolicy, error: streakError } = useSWR(
    `${API_BASE_URL}/api/v1/streakPolicies?select=name,description,goalPolicies,timeLimit,ext`,
    async (url) => {
      const response = await axios.get(url);
      return response.data;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  return {
    getPerks,
    getCoupons,
    getCouponList,
    getActivity,
    streakPolicy,
    streakError
  };
};