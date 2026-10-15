import { Outlet } from "react-router-dom";
import PageBreadcrumb from "@/shared/components/dashboard/common/PageBreadCrumb";
import PageMeta from "@/shared/components/dashboard/common/PageMeta";

export default function ProductLayout() {
    return (
        <>
            <PageMeta
                title="Product | Dashboard"
                description="Manage your Product."
            />

            <PageBreadcrumb
                pageTitle="Product"
                items={[
                    { label: "Dashboard", href: "/admin" },
                    { label: "Product", href: "/products" }
                ]}
            />

            <Outlet />

        </>
    );
}