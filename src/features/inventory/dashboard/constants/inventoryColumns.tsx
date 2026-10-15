import type { Column } from "@/shared/components/DataTable/types";
import type { Inventory } from "../../model/types/inventory.types";
import { getLocalizedName } from "@/shared/utils/localizeName";
import type { TFunction } from "i18next";
import { Link } from "react-router-dom"; // <-- استيراد Link

interface GetInventoryColumnsProps {
  t: TFunction;
  lang: string;
}

export function getInventoryColumns({
  t,
  lang,
}: GetInventoryColumnsProps): Column<Inventory>[] {
  return [
    {
      id: "product",
      header: t("inventory.product_variant", "Product / Variant"),
      // استخدام render بدلاً من accessor لنتمكن من إرجاع عناصر تفاعلية (JSX)
      render: (_, row) => {
        const productName = getLocalizedName(row?.product_variant?.product_name ?? "", lang);
        const sku = row?.product_variant?.sku;
        const displayText = productName ? `${productName} (${sku ?? '-'})` : (sku ?? '-');

        return (
          <Link
            to={`/admin/inventory/${row.id}`} // الانتقال للمسار الحيوي مع الـ ID
            className="font-semibold text-[var(--color-primary)] hover:underline transition-colors"
          >
            {displayText}
          </Link>
        );
      },
    },
    {
      id: "stock_quantity",
      header: t("inventory.stock_quantity", "Stock Quantity"),
      accessor: "stock_quantity",
      render: (value) => (
        <span className="font-semibold text-[var(--color-text-primary)]">
          {String(value ?? 0)}
        </span>
      ),
    },
    {
      id: "reserved_quantity",
      header: t("inventory.reserved_quantity", "Reserved Quantity"),
      accessor: "reserved_quantity",
      render: (value) => (
        <span className="text-[var(--color-text-secondary)]">
          {String(value ?? 0)}
        </span>
      ),
    },
    {
      id: "available_stock",
      header: t("inventory.available_quantity", "Available Quantity"),
      accessor: (row) => row.available_stock ?? (row.stock_quantity - (row.reserved_quantity ?? 0)),
      render: (value) => {
        const qty = Number(value) || 0;
        return (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            qty > 0 
              ? "bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20" 
              : "bg-[var(--color-error)]/10 text-[var(--color-error)] border border-[var(--color-error)]/20"
          }`}>
            {qty}
          </span>
        );
      },
    },
  ];
}