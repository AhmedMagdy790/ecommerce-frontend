// src/features/product/dashboard/lazy.ts
import { lazy, type ComponentType } from "react";
import { APP_CONFIG } from "@/app/config/app.config";

import InventoryPage from "./pages/InventoryPage";


export const InventoryPageLazy: ComponentType<any> = APP_CONFIG.lazyRoutes
  ? lazy(() => import("./pages/InventoryPage"))
  : InventoryPage;
