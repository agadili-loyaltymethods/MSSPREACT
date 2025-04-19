import { useAppSelector } from './useAppSelector';

export function useTokenDetails() {
  const location = useAppSelector(state => state.location.location);

  const openExternalLink = (path: string, query: string = '') => {
    const msspUrl = 'http://localhost:3001';
    const loyaltyID = localStorage.getItem('loyaltyId');
    
    const params = new URLSearchParams();
    if (loyaltyID) params.append('loyaltyId', loyaltyID);
    if (location) params.append('location', location);
    if (query) params.append('coupon', btoa(query));
    
    const targetUrl = `${msspUrl}/${path}${params.toString() ? `?${params.toString()}` : ''}`;
    window.open(targetUrl);
  };

  return {
    openExternalLink,
  };
}