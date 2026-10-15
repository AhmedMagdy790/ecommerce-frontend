// src/features/shipping/routes.tsx
import { type RouteObject } from 'react-router-dom';
import ShippingCouriersPage from './pages/ShippingCouriersPage';
import ShippingRatesPage from './pages/ShippingRatesPage';
import ShippingLayout from './components/ShippingLayout';

export const shippingRoutes: RouteObject = {
  path: "shipping",
  element: <ShippingLayout />,
  children: [
    {
      index: true,
      element: <ShippingCouriersPage />,
    },
    {
      path: "rates",
      element: <ShippingRatesPage />,
    },
  ],
};