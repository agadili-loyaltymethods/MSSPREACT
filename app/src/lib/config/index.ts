
export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL,
  },
  auth: {
    tokenKey: 'rcx_auth_token',
  },
  app: {
    name: 'RCX Member Self Service Portal',
    version: '0.1.0',
  },
  routes: {
    auth: {
      login: '/login',
      enroll: '/enroll',
    },
    app: {
      dashboard: '/dashboard',
      purchase: '/purchase',
      rewards: '/rewards',
      purchaseHistory: '/purchase-history',
      checkout: '/checkout',
      purchaseConfirmation: '/purchase-confirmation',
      pageNotFound: '/page-not-found',
    },
  },
};
