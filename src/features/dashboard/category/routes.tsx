import { type RouteObject } from 'react-router-dom';
import CategoryLayout from './components/CategoryLayout';
import CategoryPage from "./pages/CategoryPage";

export const categoryRoutes: RouteObject = {
  element: <CategoryLayout />,
  children: [
    {
      index: true,
      element: <CategoryPage />,
    }
  ],
};