import { useCallback } from 'react';
import axios from 'axios';
import useSWR from 'swr';

const API_BASE_URL = import.meta.env.VITE_REST_URL;

export const useProduct = () => {
  const { data: products, error: productsError, mutate: refreshProducts } = useSWR(
    `${API_BASE_URL}/products`,
    async (url) => {
      const response = await axios.get(url);
      return response.data;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  const getOtherProducts = useCallback(async (category: string, subcategory?: string) => {
    const params: any = { category };
    if (subcategory) {
      params.subcategory = subcategory;
    }

    const cacheKey = `${API_BASE_URL}/otherProducts?category=${category}${subcategory ? `&subcategory=${subcategory}` : ''}`;
    
    const { data, error } = useSWR(cacheKey, async () => {
      const response = await axios.get(`${API_BASE_URL}/otherProducts`, { params });
      return response.data;
    }, {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    });

    return { data, error };
  }, []);

  const clearCache = useCallback(() => {
    refreshProducts();
  }, [refreshProducts]);

  return {
    products,
    productsError,
    getOtherProducts,
    clearCache
  };
};