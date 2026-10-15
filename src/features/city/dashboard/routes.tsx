import { type RouteObject } from 'react-router-dom';
import CityPage from './pages/cityPage';



export const cityRoutes: RouteObject = {
  path: "locations/cities",
  children: [
    {
      index: true,
      element: <CityPage />,
    },

  ],
};