import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLang } from "@/shared/context/LanguageContext";
import { useCartStore } from "@/features/cart/model/store/cart.store";

export default function CartButton() {
  const { t } = useTranslation("common");
  const { lang, dir } = useLang();

  // حساب مجموع العناصر مباشرة
  const totalItems = useCartStore((state) => 
    state.items.reduce((total, item) => total + (item.quantity || 0), 0)
  );

  return (
    <Link
      to="/cart"
      aria-label={t("cart.title", "Cart")}
      title={t("cart.title", "Cart")}
      className="relative inline-flex items-center justify-center transition-all duration-fast hover:scale-105 active:scale-95 group cursor-pointer"
      style={{
        height: "40px",
        width: "40px",
        borderRadius: "var(--radius-lg)",
        backgroundColor: "var(--color-surface-secondary)",
        border: "1px solid var(--color-border)",
        color: "var(--color-text-primary)",
      }}
    >
      <ShoppingBag
        size={18}
        strokeWidth={2.2}
        className="transition-transform duration-normal group-hover:scale-110"
      />

      {totalItems > 0 && (
        <span
          aria-live="polite"
          className="absolute flex items-center justify-center font-semibold animate-in zoom-in-50 duration-200"
          style={{
            top: "-6px",
            [dir === "rtl" ? "left" : "right"]: "-6px",
            minHeight: "18px",
            minWidth: "18px",
            paddingLeft: "4px",
            paddingRight: "4px",
            borderRadius: "var(--radius-full)",
            backgroundColor: "var(--color-danger, var(--red-500, #ef4444))",
            color: "var(--color-text-inverse, #ffffff)",
            fontSize: "10px",
            fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)",
            boxShadow: "var(--shadow-xs)",
          }}
        >
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}