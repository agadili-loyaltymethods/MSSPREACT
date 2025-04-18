import { useState, useCallback } from 'react';

interface WidgetState {
  isLoading: boolean;
  error: string | null;
  data: any;
}

export const useWidget = (initialData: any = null) => {
  const [state, setState] = useState<WidgetState>({
    isLoading: false,
    error: null,
    data: initialData
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setData = useCallback((data: any) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      data: initialData
    });
  }, [initialData]);

  const loadData = useCallback(async (fetchFn: () => Promise<any>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
      return result;
    } catch (error: any) {
      setError(error.message || 'An error occurred');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setData]);

  return {
    ...state,
    setLoading,
    setError,
    setData,
    reset,
    loadData
  };
};