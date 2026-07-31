import { type RouteObject } from 'react-router-dom';
import CityPage from "./pages/CityPage";

export const cityRoutes: RouteObject = {

  children: [
    {
      path: "cities",
      element: <CityPage /> ,
    }
  ]
};