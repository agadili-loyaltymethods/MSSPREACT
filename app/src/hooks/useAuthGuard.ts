import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from './useLogin';
import { useAlert } from './useAlert';

export const useAuthGuard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { ensureAuthenticated } = useLogin();
  const { errorAlert } = useAlert();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await ensureAuthenticated();
        setIsAuthenticated(!!token);
      } catch (error) {
        errorAlert('Authentication failed');
        navigate('/page-not-found');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [ensureAuthenticated, navigate, errorAlert]);

  return { isAuthenticated, isLoading };
};