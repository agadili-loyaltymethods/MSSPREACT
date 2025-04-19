import { AuthHelper } from '@/lib/utils/auth-helper';
import { useState, useCallback, useEffect } from 'react';
// import { getToken, setToken, removeToken, isAuthenticated } from '../lib/utils/auth-helper';

export const useAuth = () => {
  const [isAuthenticatedState, setIsAuthenticatedState] = useState<boolean>(AuthHelper.isAuthenticated());

  const updateAuthStatus = useCallback(() => {
    setIsAuthenticatedState(AuthHelper.isAuthenticated());
  }, []);

  useEffect(() => {
    updateAuthStatus();
  }, [updateAuthStatus]);

  const login = useCallback((token: string) => {
    AuthHelper.setToken(token);
    updateAuthStatus();
  }, [updateAuthStatus]);

  const logout = useCallback(() => {
    AuthHelper.removeToken();
    updateAuthStatus();
  }, [updateAuthStatus]);

  return {
    isAuthenticated: isAuthenticatedState,
    login,
    logout,
    updateAuthStatus
  };
};