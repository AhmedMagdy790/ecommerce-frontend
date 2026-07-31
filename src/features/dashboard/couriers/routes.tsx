import { type RouteObject } from "react-router-dom";

import ShippingCourierLayout from "./components/ShippingCourierLayout";
import ShippingCourierPage from "./pages/ShippingCourierPage";
import ShippingRatesPage from "./pages/ShippingRatesPage";
import ShippingSettingsPage from "./pages/ShippingSettingsPage";

export const shippingRoutes: RouteObject = {

  element: <ShippingCourierLayout />,
  children: [
    {
      path: "couriers",
      element: <ShippingCourierPage />,
    },
    {
      path: "rates",
      element: <ShippingRatesPage />,
    },
    {
      path: "cities",
      element: <ShippingSettingsPage />,
    },
  ],
};