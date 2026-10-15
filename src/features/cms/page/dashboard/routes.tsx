import { type RouteObject } from "react-router-dom";

import PageLayout from "./components/PageLayout";
import PagePage from "./pages/PagePage";
import PageBuilderPage from "./pages/PageBuilderPage";

export const pageRoutes: RouteObject = {
  path: "cms",
  element: <PageLayout />,
  children: [
    {
      path: "pages",
      element: <PagePage />,
    },
    {
      path: "pages/:id/builder",
      element: <PageBuilderPage />,
    },
  ],
};