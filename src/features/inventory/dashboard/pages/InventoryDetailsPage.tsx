import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useInventoryStore } from "../../model/store/useInvntoryStore";


export default function InventoryDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation("inventory");
    const { dir } = useLanguage();

    const { items, isFetching } = useInventoryStore();
    const inventoryItem = items.find((item) => String(item.id) === String(id));

    if (isFetching) {
        return <div className="p-8 text-center">{t("common.loading", "جاري التحميل...")}</div>;
    }

    if (!inventoryItem) {
        return <div className="p-8 text-center text-red-500">{t("inventory.not_found", "عنصر المخزون غير موجود")}</div>;
    }

    const productName = inventoryItem?.product_variant?.sku;
    const sku = inventoryItem?.product_variant?.sku;

    return (
        <div className="p-6 lg:p-8 space-y-6" dir={dir}>
            {/* زر العودة */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
                {dir === "rtl" ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                <span>{t("common.back", "العودة")}</span>
            </button>

            {/* رأس الصفحة مع بيانات المنتج */}
            <div className="bg-[var(--card-bg)] p-6 rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-[var(--shadow-xs)]">
                <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
                    {productName || "Product"} — <span className="text-sm font-normal text-[var(--color-text-secondary)]">SKU: {sku}</span>
                </h1>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                    {t("inventory.details_subtitle", "عرض تفاصيل الكميات وحركات المخزون")}
                </p>
            </div>

            {/* محتوى التفاصيل / الكميات */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[var(--card-bg)] p-6 rounded-[var(--radius-xl)] border border-[var(--color-border)]">
                    <p className="text-xs text-[var(--color-text-muted)]">{t("inventory.stock", "المخزون الحالي")}</p>
                    <p className="text-2xl font-bold text-[var(--color-text-primary)] mt-2">
                        {inventoryItem.stock_quantity ?? 0}
                    </p>
                </div>
                <div className="bg-[var(--card-bg)] p-6 rounded-[var(--radius-xl)] border border-[var(--color-border)]">
                    <p className="text-xs text-[var(--color-text-muted)]">{t("inventory.reserved", "المخزون المحجوز")}</p>
                    <p className="text-2xl font-bold text-[var(--color-text-primary)] mt-2">
                        {inventoryItem.reserved_quantity ?? 0}
                    </p>
                </div>
                <div className="bg-[var(--card-bg)] p-6 rounded-[var(--radius-xl)] border border-[var(--color-border)]">
                    <p className="text-xs text-[var(--color-text-muted)]">{t("inventory.available", "المخزون المتاح")}</p>
                    <p className="text-2xl font-bold text-[var(--color-success)] mt-2">
                        {inventoryItem.available_stock ?? (inventoryItem.stock_quantity - (inventoryItem.reserved_quantity ?? 0))}
                    </p>
                </div>
            </div>
        </div>
    );
}