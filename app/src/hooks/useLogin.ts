import { useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth';
import { useAlert } from './useAlert';
import { useMember } from './useMember';
import { useDispatch } from 'react-redux';
import { addMember } from '@/lib/store/slices/memberSlice';
import { Member } from '@/models/member';
// import { addMember } from '../states/actions/member.action';

export const useLogin = () => {
  const [pendingLoginRequest, setPendingLoginRequest] = useState<Promise<string> | null>(null);
  const auth = useAuth();
  const { getMember } = useMember();
  const { errorAlert } = useAlert();
  const dispatch = useDispatch();

  const login = useCallback(async (): Promise<string> => {
    if (pendingLoginRequest) {
      return pendingLoginRequest;
    }

    const loginPromise = async () => {
      try {
        const response = await axios.post<{ token: string }>('/api/v1/login', {
          username: 'demo/vgunasekaran',
          password: 'Password1',
        });

        if (!response?.data?.token) {
          throw new Error('Login failed');
        }

        auth.login(response.data.token);

        try {
          const member: Member = await getMember();
          dispatch(addMember(member));
          localStorage.setItem('loyaltyId', member.loyaltyId);
        } catch (error: any) {
          errorAlert(error?.response?.data?.error || error?.message);
        }

        return response.data.token;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      } finally {
        setPendingLoginRequest(null);
      }
    };

    setPendingLoginRequest(loginPromise());
    return loginPromise();
  }, [auth, getMember, dispatch, errorAlert]);

  const ensureAuthenticated = useCallback(async (): Promise<string> => {
    let token = localStorage.getItem('token');
    if (!token) {
      token = await login();
    }
    return token ?? '';
  }, [login]);

  return {
    login,
    ensureAuthenticated
  };
};