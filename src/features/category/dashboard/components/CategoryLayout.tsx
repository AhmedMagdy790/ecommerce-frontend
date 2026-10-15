import { Outlet } from "react-router-dom";
import PageBreadcrumb from "@/shared/components/dashboard/common/PageBreadCrumb";
import PageMeta from "@/shared/components/dashboard/common/PageMeta";

export default function CategoryLayout() {
  return (
    <>
      <PageMeta
        title="Category | Dashboard"
        description="Manage your Category."
      />

      <PageBreadcrumb
        pageTitle="Edit Category"
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Category", href: "/Category" }
        ]}
      />

      <Outlet /> 

    </>
  );
}