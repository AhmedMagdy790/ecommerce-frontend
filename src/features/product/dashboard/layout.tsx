// src/features/product/dashboard/layout.tsx

import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";

import PageHeader from "@/shared/components/PageHeader";
import Breadcrumb from "@/shared/components/Breadcrumb";

export default function ProductLayout() {
  const { t } = useTranslation("product");

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: t("breadcrumb.dashboard", "Dashboard"), href: "/admin" },
          { label: t("breadcrumb.products", "Products") },
        ]}
      />

      <PageHeader
        title={t("layout.title", "Products")}
        description={t("layout.description", "Manage your products")}
      />

      <Outlet />
    </div>
  );
}