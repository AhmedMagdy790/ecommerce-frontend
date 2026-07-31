import { Outlet } from "react-router-dom";
import PageBreadcrumb from "@/shared/components/dashboard/common/PageBreadCrumb";
import PageMeta from "@/shared/components/dashboard/common/PageMeta";

export default function CustomerLayout() {
    return (
        <>
            <PageMeta
                title="Customer | Dashboard"
                description="Manage Customers."
            />

            <PageBreadcrumb
                pageTitle="Customer"
                items={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Customer", href: "/customers" }
                ]}
            />

            <Outlet />

        </>
    );
}