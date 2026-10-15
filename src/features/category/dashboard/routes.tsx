// src/features/category/dashboard/routes.tsx
import { type RouteObject } from 'react-router-dom';
import CategoryLayout from './components/CategoryLayout';
import CategoryPage from "./pages/CategoryPage";

export const categoryRoutes: RouteObject = {
   path: "categories",
  element: <CategoryLayout />,
  children: [
    {
      index: true,
      element: <CategoryPage />,
    }
  ],
};