import { createBrowserRouter } from "react-router-dom";
import { publicRoutes } from "./public.routes";
import { authRoutes } from "./auth.routes";
import NotFoundPage from "@/pages/Errors/NotFoundPage";
import { dashboardRoutes } from "@/features/dashboard/dashboard/routes";

export const router = createBrowserRouter([
  publicRoutes,
  authRoutes,
  dashboardRoutes,
  { path: "*", element: <NotFoundPage /> }
]);