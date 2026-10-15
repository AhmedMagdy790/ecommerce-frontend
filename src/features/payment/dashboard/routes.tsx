import type { RouteObject } from "react-router-dom";
import PaymentLayout from "./components/PaymentLayout";
import PaymentPage from "./pages/PaymentPage";

export const paymentGatewayRoutes: RouteObject = {
  path: "payment-gateways",
  element: <PaymentLayout />,
  children: [
    { index: true, element: <PaymentPage /> }
  ],
};
