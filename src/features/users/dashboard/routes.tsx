import type { RouteObject } from "react-router-dom";
import UsersPage from "./pages/UsersPage";

export const userRoutes: RouteObject = {
  path: "users",
  element: <UsersPage />,
};
