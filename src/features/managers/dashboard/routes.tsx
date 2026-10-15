// src/features/category/dashboard/routes.tsx
import { type RouteObject } from 'react-router-dom';
import ManagerPage from './pages/ManagerPage';
import ManagerLayout from './components/ManagerLayout';

export const managerRoutes: RouteObject = {
   path: "managers",
  element: <ManagerLayout />,
  children: [
    {
      index: true,
      element: <ManagerPage />,
    }
  ],
};