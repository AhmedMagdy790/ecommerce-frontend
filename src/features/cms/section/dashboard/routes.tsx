import { type RouteObject } from "react-router-dom";

import SectionLayout from "./components/SectionLayout";
import SectionPage from "./pages/SectionPage";
import SectionItemPage from "./pages/SectionItemPage";


export const sectionRoutes: RouteObject = {
  path: "cms",
  element: <SectionLayout />,
  children: [
    {
      path: "sections",
      element: <SectionPage />,
    },
    {
      path: "sections/:sectionId/items",
      element: <SectionItemPage />,
    },
  ],
};