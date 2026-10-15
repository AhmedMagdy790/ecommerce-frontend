// src/features/roles/dashboard/routes.tsx
import { type RouteObject } from 'react-router-dom';
import RolesPage from './pages/RolesPage';


export const rolesRoutes: RouteObject = {
  path: "roles",
  children: [
    {
      index: true,
      element: <RolesPage />,
    },
  ],
};