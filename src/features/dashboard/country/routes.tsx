import { type RouteObject } from 'react-router-dom';
import CountryPage from "./pages/CountryPage";

export const countryRoutes: RouteObject = {

  children: [
    {
      path: "countries",
      element: <CountryPage />
    }
  ]
};

