import { Outlet } from "react-router-dom";

import PageMeta from "@/shared/components/dashboard/common/PageMeta";
import PageBreadcrumb from "@/shared/components/dashboard/common/PageBreadCrumb";

import { TruckIcon } from "lucide-react";

export default function ShippingCourierLayout() {
  return (
    <>
      {/* SEO Meta */}
      <PageMeta
        title="Shipping Couriers | Dashboard"
        description="Manage shipping couriers, APIs, and delivery settings."
      />

      {/* Breadcrumb */}
      <PageBreadcrumb
        pageTitle="Shipping Couriers"
        items={[
          { label: "Dashboard", href: "/dashboard" },
          {
            label: "Shipping Couriers",
            href: "/admin/shipping-couriers",
          },
        ]}
      />

      {/* Optional Header Section */}
      <div className="flex items-center gap-3 px-6 pt-4">
        <div className="p-2.5 bg-blue-500/10 rounded-[var(--radius-xl)] border border-blue-500/20">
          <TruckIcon className="w-5 h-5 text-blue-500" />
        </div>

        <div>
          <h1 className="text-lg font-bold text-[var(--color-text-primary)]">
            Shipping Management
          </h1>

          <p className="text-xs text-[var(--color-text-secondary)]">
            Control couriers, API integrations, COD, and tracking
          </p>
        </div>
      </div>

      {/* Page Content */}
      <div className="p-6">
        <Outlet />
      </div>
    </>
  );
}