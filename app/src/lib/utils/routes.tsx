import { Layout } from '@/components/layout';
import PrivateRoute from '@/components/private-route';
import { RouteObject } from 'react-router-dom';
import { Dashboard } from '@/components/dashboard';
import { Purchase } from '@/components/purchase';
import { Rewards } from '@/components/rewards';
import { PurchaseHistory } from '@/components/purchase-history';
import { Checkout } from '@/components/checkout';
import { PageNotFound } from '@/components/page-not-found';


export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <PrivateRoute><Dashboard /></PrivateRoute>,
      },
      {
        path: 'dashboard',
        element: <PrivateRoute><Dashboard /></PrivateRoute>,
      },
      {
        path: 'purchase',
        element: <PrivateRoute><Purchase /></PrivateRoute>,
      },
      {
        path: 'rewards',
        element: <PrivateRoute><Rewards /></PrivateRoute>,
      },
      {
        path: 'purchase-history',
        element: <PrivateRoute><PurchaseHistory /></PrivateRoute>,
      },
      {
        path: 'checkout',
        element: <PrivateRoute><Checkout /></PrivateRoute>,
      },
      // {
      //   path: 'purchase-confirmation',
      //   element: <PrivateRoute><PurchaseConfirmation /></PrivateRoute>,
      // },
      {
        path: 'page-not-found',
        element: <PageNotFound />,
      },
      {
        path: '*',
        element: <PageNotFound />,
      },
    ],
  },
];