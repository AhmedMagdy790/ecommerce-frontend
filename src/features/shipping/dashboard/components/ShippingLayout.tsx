// src/features/shipping/components/ShippingLayout.tsx
import { Outlet } from "react-router-dom";
import PageBreadcrumb from "@/shared/components/dashboard/common/PageBreadCrumb";
import PageMeta from "@/shared/components/dashboard/common/PageMeta";

export default function ShippingLayout() {
  return (
    <>
      <PageMeta
        title="Shipping Couriers | Dashboard"
        description="Manage your shipping providers and delivery partners."
      />

      <PageBreadcrumb
        pageTitle="Shipping Couriers"
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Shipping Couriers", href: "/shipping-couriers" }
        ]}
      />

      <Outlet />
    </>
  );
}