import { lazy, type ComponentType } from "react";
import { APP_CONFIG } from "@/app/config/app.config";

import InventoryPage from "./pages/InventoryPage";
// import InventoryEditPage from "./pages/InventoryEditPage";
// import StockAdjustmentPage from "./pages/StockAdjustmentPage";

export const InventoryPageLazy: ComponentType<any> = APP_CONFIG.lazyRoutes
  ? lazy(() => import("./pages/InventoryPage"))
  : InventoryPage;

// export const InventoryEditPageLazy: ComponentType<any> = APP_CONFIG.lazyRoutes
//   ? lazy(() => import("./pages/InventoryEditPage"))
//   : InventoryEditPage;

// export const StockAdjustmentPageLazy: ComponentType<any> = APP_CONFIG.lazyRoutes
//   ? lazy(() => import("./pages/StockAdjustmentPage"))
//   : StockAdjustmentPage;