// src/app/router/dashboardRoutes.tsx
import { type RouteObject } from "react-router-dom";

import DashboardLayout from "@/app/layouts/DashboardLayout";
import { AdminGuard } from "@/app/Guard/AdminGuard";
import DashboardPage from "@/features/dashboard/pages/Dashboard";

import { productRoutes } from "@/features/product/dashboard/routes";
import { categoryRoutes } from "@/features/category/dashboard/routes";
import { countryRoutes } from "@/features/country/dashboard/routes";
import { cityRoutes } from "@/features/city/dashboard/routes";
// import { productVariantRoutes } from "@/features/productsVariant/routes";
// import { ordersRoutes } from "@/features/orders/routes";
import { shippingRoutes } from "@/features/shipping/dashboard/routes";
// import { customerRoutes } from "@/features/customer/routes";
import { paymentGatewayRoutes } from "@/features/payment/dashboard/routes";

import { pageRoutes } from "@/features/cms/page/dashboard/routes";
import { sectionRoutes } from "@/features/cms/section/dashboard/routes";
import { inventoryRoutes } from "@/features/inventory/dashboard/routes";
import { userRoutes } from "@/features/users/dashboard/routes";
import { profileRoutes } from "@/features/profile/dashboard/routes";
import { navigationRoutes } from "@/features/cms/navigation/dashboard/routes";
import { orderRoutes } from "@/features/order/dashboard/routes";
import { rolesRoutes } from "@/features/roles/dashboard/routes";
import { managerRoutes } from "@/features/managers/dashboard/routes";

export const dashboardRoutes: RouteObject = {
  element: <AdminGuard />,
  children: [
    {
      path: "/admin",
      element: <DashboardLayout />,
      children: [
        {
          index: true,
          element: <DashboardPage />,
        },

        profileRoutes,
        rolesRoutes,
        categoryRoutes,
        countryRoutes,
        cityRoutes,
        productRoutes,
        userRoutes,
        managerRoutes,
        orderRoutes,
        // productVariantRoutes,
        inventoryRoutes,
        // ordersRoutes,
        shippingRoutes,
        // customerRoutes,
        paymentGatewayRoutes,
        pageRoutes,
        sectionRoutes,
        navigationRoutes
      ],
    },
  ],
};