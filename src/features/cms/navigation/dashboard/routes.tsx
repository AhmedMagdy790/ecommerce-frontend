import { type RouteObject } from 'react-router-dom';
import NavigationPage from './pages/NavigationPage';
import NavigationItemsPage from './pages/NavigationItemsPage';

export const navigationRoutes: RouteObject = {
  path: "cms/navigation",
  children: [
    {
      index: true,
      element: <NavigationPage />,
    },
    {
      path: ":menuId/items",
      element: <NavigationItemsPage />,
    },
  ],
};