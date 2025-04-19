import { useCallback } from 'react';
import axios from 'axios';
import { Member } from '../models/member';
import { ActivityHistory } from '../models/activity-history';
import { Streaks } from '../models/streaks';

const API_BASE_URL = import.meta.env.VITE_REST_URL;
const RC_API_BASE_URL = import.meta.env.VITE_RC_REST_URL;
interface MemberResponse{
  data: MemberData[];
}

interface ActivityHistoryResponse{
  data: ActivityHistory[] ;
}

interface StreakResponse{
  data: Streaks[] ;
}

interface MemberData{
  member: Member;
}

export const useMember = () => {
  const getMember = useCallback(async (loyaltyId: string = '1001'): Promise<Member> => {
    const response: MemberResponse = await axios.get(`${API_BASE_URL}/api/v1/members/${loyaltyId}/profile`, {
      params: {
        linked: true,
        divide: true,
        query: true
      }
    });
    
    return {
      ...response.data[0].member,
      loyaltyId
    };
  }, []);

  const getPromo = useCallback(async (id: string, locationNum?: string) => {
    const url = `${API_BASE_URL}/api/v1/members/${id}/rules`;
    const params = {
      filter: 'promo',
      ...(locationNum && { stores: locationNum })
    };
    
    const response = await axios.get(url, { params });
    return response.data;
  }, []);

  const getOffers = useCallback(async (id: string, locationNum?: string) => {
    const url = `${API_BASE_URL}/api/v1/members/${id}/offers`;
    const params = {
      filter: 'offers,global',
      ...(locationNum && { stores: locationNum })
    };
    
    const response = await axios.get(url, { params });
    return response.data;
  }, []);

  const getVouchers = useCallback(async (member: Member) => {
    if (!member) {
      throw new Error('Member data is required');
    }

    const currentTier = member.tiers?.find((tier: any) => tier.primary);
    if (!currentTier) {
      throw new Error('No primary tier found for the member');
    }

    const query = {
      intendedUse: "Reward",
      $or: [
        { tierPolicyLevels: { $exists: false } },
        { tierPolicyLevels: { $size: 0 } },
        {
          tierPolicyLevels: {
            $elemMatch: {
              policyId: currentTier.policyId,
              level: currentTier.level.name
            }
          }
        }
      ]
    };

    const response = await axios.get(`${API_BASE_URL}/api/v1/rewardpolicies`, {
      params: { query: JSON.stringify(query) }
    });
    
    return response.data;
  }, []);

  const buyVoucher = useCallback(async (payload: any) => {
    const response = await axios.post(`${API_BASE_URL}/buy`, payload);
    return response.data;
  }, []);

  const getMemberVouchers = useCallback(async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/members/${id}/offers`, {
      params: { filter: 'rewards' }
    });
    return response.data;
  }, []);

  const getActivityHistory = useCallback(async (memberId: string): Promise<ActivityHistory[]> => {
    const response: ActivityHistoryResponse = await axios.get(`${RC_API_BASE_URL}/api/v1/activityhistories`, {
      params: { query: JSON.stringify({ memberID: memberId }) }
    });
    return response.data;
  }, []);

  const getStreaks = useCallback(async (id: string): Promise<Streaks[]> => {
    const response: StreakResponse = await axios.get(`${API_BASE_URL}/streaks`, {
      params: { query: id }
    });
    return response.data;
  }, []);

  const getAggregate = useCallback(async ({ week, year, metricName }: { 
    week: string; 
    year: string; 
    metricName: string 
  }) => {
    const response = await axios.get(`${API_BASE_URL}/aggregate`, {
      params: { week, year, metricName }
    });
    return response.data;
  }, []);

  return {
    getMember,
    getPromo,
    getOffers,
    getVouchers,
    buyVoucher,
    getMemberVouchers,
    getActivityHistory,
    getStreaks,
    getAggregate
  };
};