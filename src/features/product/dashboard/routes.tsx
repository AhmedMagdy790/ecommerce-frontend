// src/features/product/dashboard/routes.tsx
import { type RouteObject } from "react-router-dom";
import { Suspense } from "react";

import ProductLayout from "./layout";
import { PageLoader } from "@/shared/components/LazyRoute";
import { 
  ProductPageLazy, 
  // ProductCreatePageLazy, 
  // ProductEditPageLazy 
} from "./lazy";

export const productRoutes: RouteObject = {
  path: "products",
  element: <ProductLayout />,
  children: [
    {
      index: true,
      element: (
        <Suspense fallback={<PageLoader />}>
          <ProductPageLazy />
        </Suspense>
      ),
    },
    // {
    //   path: "create",
    //   element: (
    //     <Suspense fallback={<PageLoader />}>
    //       <ProductCreatePageLazy />
    //     </Suspense>
    //   ),
    // },
    // {
    //   path: "edit/:id",
    //   element: (
    //     <Suspense fallback={<PageLoader />}>
    //       <ProductEditPageLazy />
    //     </Suspense>
    //   ),
    // },
  ],
};