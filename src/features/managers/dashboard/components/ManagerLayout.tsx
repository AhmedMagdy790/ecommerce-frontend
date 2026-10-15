import { Outlet } from "react-router-dom";
import PageBreadcrumb from "@/shared/components/dashboard/common/PageBreadCrumb";
import PageMeta from "@/shared/components/dashboard/common/PageMeta";

export default function ManagerLayout() {
  return (
    <>
      <PageMeta
        title="Managers Management | Dashboard"
        description="Manage admin users, roles, and account statuses."
      />

      <PageBreadcrumb
        pageTitle="Managers"
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Managers", href: "/dashboard/managers" }
        ]}
      />

      <div className="space-y-6">
        <Outlet />
      </div>
    </>
  );
}