// src/features/order/dashboard/components/OrderLayout.tsx
import { Outlet } from "react-router-dom";
import PageBreadcrumb from "@/shared/components/dashboard/common/PageBreadCrumb";
import PageMeta from "@/shared/components/dashboard/common/PageMeta";

export default function OrderLayout() {
  return (
    <>
      <PageMeta
        title="Orders | Dashboard"
        description="Manage your store orders."
      />

      <PageBreadcrumb
        pageTitle="Orders Management"
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Orders", href: "/orders" }
        ]}
      />

      <Outlet />
    </>
  );
}