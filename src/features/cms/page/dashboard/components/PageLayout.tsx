import { Outlet } from "react-router-dom";
import PageBreadcrumb from "@/shared/components/dashboard/common/PageBreadCrumb";
import PageMeta from "@/shared/components/dashboard/common/PageMeta";

export default function PageLayout() {
  return (
    <>
      <PageMeta
        title="Pages | Dashboard"
        description="Manage your CMS pages."
      />

      <PageBreadcrumb
        pageTitle="Pages"
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "CMS Pages", href: "/dashboard/cms/pages" }
        ]}
      />

      <Outlet />
    </>
  );
}