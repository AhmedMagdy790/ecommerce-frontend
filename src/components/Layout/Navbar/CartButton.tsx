import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";

// import { useCart } from "@/hooks/useCart";

export default function CartButton() {
  const { t } = useTranslation("common");

  // const { totalItems } = useCart();
  const totalItems = 4;

  return (
    <Link
      to="/cart"
      aria-label={t("cart.title")}
      title={t("cart.title")}
      className="
        relative
        inline-flex
        h-10
        w-10
        items-center
        justify-center
        rounded-lg
        text-[var(--color-text-primary)]
        transition-colors
        duration-[var(--duration-fast)]
        hover:bg-[var(--color-surface)]
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[var(--color-primary)]
      "
    >
      <ShoppingBag
        size={22}
        aria-hidden="true"
      />

      {totalItems > 0 && (
        <span
          aria-live="polite"
          className="
            absolute
            -top-1
            -end-1
            flex
            min-h-5
            min-w-5
            items-center
            justify-center
            rounded-full
            bg-[var(--color-error)]
            px-1
            text-xs
            font-semibold
            text-[var(--color-text-inverse)]
          "
        >
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}