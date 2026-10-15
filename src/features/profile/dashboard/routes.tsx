import type { RouteObject } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage";
import AddressPage from "./pages/AddressPage";
import SecurityPage from "./pages/SecurityPage";

export const profileRoutes: RouteObject = {
  path: "profile",
  children: [
    {
      index: true,
      element: <ProfilePage />,
    },
    {
      path: "address",
      element: <AddressPage />,
    },
    {
      path: "security",
      element: <SecurityPage />,
    },
  ],
};