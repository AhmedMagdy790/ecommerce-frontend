import { Outlet } from "react-router-dom";
import PageBreadcrumb from "@/shared/components/dashboard/common/PageBreadCrumb";
import PageMeta from "@/shared/components/dashboard/common/PageMeta";

export default function InventoryLayout() {
  return (
    <>
      <PageMeta
        title="Inventory | Dashboard"
        description="Manage your inventory and stock levels."
      />

      <PageBreadcrumb
        pageTitle="Inventory Management"
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Inventory", href: "/inventory" }
        ]}
      />

      <Outlet /> 
    </>
  );
}