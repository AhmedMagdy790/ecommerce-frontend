// src/features/order/dashboard/routes.tsx
import { type RouteObject } from 'react-router-dom';
import OrderLayout from './components/OrderLayout';
import OrderPage from './Page/OrderPage';
// import OrderPage from "./pages/OrderPage";

export const orderRoutes: RouteObject = {
  path: "orders",
  element: <OrderLayout />,
  children: [
    {
      index: true,
      element: <OrderPage />,
    },
  ],
};