import type { RouteObject } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage";
import SecurityPage from "./pages/SecurityPage";

export const profileRoutes: RouteObject = {
  path: "profile",
  children: [
    {
      index: true,
      element: <ProfilePage />,
    },
    {
      path: "security",
      element: <SecurityPage />,
    },
  ],
};