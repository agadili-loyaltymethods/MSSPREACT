import { useState, useCallback, useEffect } from 'react';
import { getToken, setToken, removeToken, isAuthenticated } from '../helpers/auth.helper';

export const useAuth = () => {
  const [isAuthenticatedState, setIsAuthenticatedState] = useState<boolean>(isAuthenticated());

  const updateAuthStatus = useCallback(() => {
    setIsAuthenticatedState(isAuthenticated());
  }, []);

  useEffect(() => {
    updateAuthStatus();
  }, [updateAuthStatus]);

  const login = useCallback((token: string) => {
    setToken(token);
    updateAuthStatus();
  }, [updateAuthStatus]);

  const logout = useCallback(() => {
    removeToken();
    updateAuthStatus();
  }, [updateAuthStatus]);

  return {
    isAuthenticated: isAuthenticatedState,
    login,
    logout,
    updateAuthStatus
  };
};