```typescript
import { useMemo } from 'react';
import api from '@/lib/axios';

interface LoginCredentials {
  username: string;
  password: string;
}

interface EnrollData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export function useLoginService() {
  const login = async (credentials: LoginCredentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  };

  const enroll = async (data: EnrollData) => {
    const response = await api.post('/auth/enroll', data);
    return response.data;
  };

  const getToken = async () => {
    const response = await api.post('/auth/token');
    return response.data;
  };

  return useMemo(() => ({
    login,
    enroll,
    getToken,
  }), []);
}
```