import { useCallback } from 'react';
import axios from 'axios';
import useSWR from 'swr';

const API_BASE_URL = import.meta.env.VITE_REST_URL;

export const useLocation = () => {
  const getLocations = useCallback(async (sort?: string | number) => {
    let url = `${API_BASE_URL}/api/v1/locations`;
    if (sort !== undefined) {
      url += `&sort=${sort}`;
    }

    const { data, error } = useSWR(url, async (url) => {
      const response = await axios.get(url);
      const data = Array.isArray(response.data) ? response.data : [response.data];
      return data.sort((a: any, b: any) => a.name.localeCompare(b.name));
    }, {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    });

    return { data, error };
  }, []);

  return {
    getLocations
  };
};