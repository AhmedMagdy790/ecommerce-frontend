import { Outlet } from "react-router-dom";
import PageBreadcrumb from "@/shared/components/dashboard/common/PageBreadCrumb";
import PageMeta from "@/shared/components/dashboard/common/PageMeta";

export default function SectionLayout() {
  return (
    <>
      <PageMeta
        title="Sections | Dashboard"
        description="Manage your CMS sections."
      />

      <PageBreadcrumb
        pageTitle="Sections"
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "CMS Sections", href: "/dashboard/cms/sections" }
        ]}
      />

      <Outlet />
    </>
  );
}