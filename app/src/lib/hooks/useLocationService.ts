```typescript
import { useMemo } from 'react';
import api from '@/lib/axios';

export function useLocationService() {
  const getLocations = async () => {
    const response = await api.get('/locations');
    return response.data;
  };

  return useMemo(() => ({
    getLocations,
  }), []);
}
```