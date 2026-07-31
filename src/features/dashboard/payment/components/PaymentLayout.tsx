import { Outlet } from "react-router-dom";
import PageBreadcrumb from "@/shared/components/dashboard/common/PageBreadCrumb";
import PageMeta from "@/shared/components/dashboard/common/PageMeta";

export default function PaymentLayout() {
    return (
        <>
            <PageMeta
                title="Payment Gateways | Dashboard"
                description="Manage your payment gateways and API configurations."
            />

            <PageBreadcrumb
                pageTitle="Payment Gateways"
                items={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Payment Gateways", href: "/payment-gateways" }
                ]}
            />

            {/* هنا سيتم عرض قائمة البوابات أو نموذج الإضافة/التعديل بناءً على المسار */}
            <div className="mt-6">
                <Outlet />
            </div>
        </>
    );
}