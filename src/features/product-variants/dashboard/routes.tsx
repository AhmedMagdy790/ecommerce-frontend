import { type RouteObject } from "react-router-dom";
import { Suspense } from "react";
import { PageLoader } from "@/shared/components/LazyRoute";

// Lazy load the inventory page
import { InventoryPageLazy } from "./lazy";

export const inventoryRoutes: RouteObject = {
  path: "inventory",
  children: [
    {
      index: true,
      element: (
        <Suspense fallback={<PageLoader />}>
          <InventoryPageLazy />
        </Suspense>
      ),
    },
  ],
};
