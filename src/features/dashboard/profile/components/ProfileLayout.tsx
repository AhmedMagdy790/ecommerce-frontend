import { Outlet } from "react-router-dom";
import PageBreadcrumb from "@/shared/components/dashboard/common/PageBreadCrumb";
import PageMeta from "@/shared/components/dashboard/common/PageMeta";

export default function ProfileLayout() {
  return (
    <>
      <PageMeta
        title="User Profile | Dashboard"
        description="Manage your profile, addresses and security settings."
      />

      <PageBreadcrumb
        pageTitle="Edit Profile"
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Profile", href: "/profile" },
        ]}
      />

      <div className="space-y-6">
        <Outlet />
      </div>
    </>
  );
}
