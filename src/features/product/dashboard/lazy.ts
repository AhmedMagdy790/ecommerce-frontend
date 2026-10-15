// src/features/product/dashboard/lazy.ts
import { lazy, type ComponentType } from "react";
import { APP_CONFIG } from "@/app/config/app.config";

import ProductPage from "./pages/ProductPage";
// import ProductCreatePage from "./pages/ProductCreatePage";
// import ProductEditPage from "./pages/ProductEditPage";

export const ProductPageLazy: ComponentType<any> = APP_CONFIG.lazyRoutes
  ? lazy(() => import("./pages/ProductPage"))
  : ProductPage;

// export const ProductCreatePageLazy: ComponentType<any> = APP_CONFIG.lazyRoutes
//   ? lazy(() => import("./pages/ProductCreatePage"))
//   : ProductCreatePage;

// export const ProductEditPageLazy: ComponentType<any> = APP_CONFIG.lazyRoutes
//   ? lazy(() => import("./pages/ProductEditPage"))
//   : ProductEditPage;