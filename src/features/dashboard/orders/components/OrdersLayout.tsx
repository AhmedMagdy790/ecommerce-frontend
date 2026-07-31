import { Outlet } from "react-router-dom";
import PageBreadcrumb from "@/shared/components/dashboard/common/PageBreadCrumb";
import PageMeta from "@/shared/components/dashboard/common/PageMeta";

export default function OrdersLayout() {
    return (
        <>
            <PageMeta
                title="Orders | Dashboard"
                description="Manage Orders."
            />

            <PageBreadcrumb
                pageTitle="Orders"
                items={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Orders", href: "/orders" }
                ]}
            />

            <Outlet />

        </>
    );
}