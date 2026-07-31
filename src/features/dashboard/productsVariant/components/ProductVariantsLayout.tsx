import { Outlet, useParams, useNavigate } from "react-router-dom";
import PageBreadcrumb from "@/shared/components/dashboard/common/PageBreadCrumb";
import PageMeta from "@/shared/components/dashboard/common/PageMeta";
import { Package, Layers, ArrowLeft } from "lucide-react";

export default function ProductVariantsLayout() {
    const { productId } = useParams();
    const navigate = useNavigate();

    const tabs = [
        {
            label: "Variants",
            path: `/products/${productId}/variants`,
            icon: Layers
        },
        {
            label: "Inventory",
            path: `/products/${productId}/inventory`,
            icon: Package
        }
    ];

    return (
        <>
            <PageMeta
                title="Product Variants | Dashboard"
                description="Manage product variants and inventory"
            />

            {/* Breadcrumb */}
            <PageBreadcrumb
                pageTitle="Product Variants"
                items={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Products", href: "/products" },
                    { label: "Variants", href: `/products/${productId}/variants` }
                ]}
            />

            {/* Content */}
            <Outlet />
        </>
    );
}
