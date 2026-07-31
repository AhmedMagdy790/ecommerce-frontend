import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function EmptyCart() {
  const { t } = useTranslation("cart");

  return (
    <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
      <div
        className="
          mb-6
          flex
          h-24
          w-24
          items-center
          justify-center
          rounded-full
          bg-[var(--color-surface)]
        "
      >
        <ShoppingCart
          size={48}
          className="text-[var(--color-text-muted)]"
          aria-hidden="true"
        />
      </div>

      <h1 className="mb-3 text-3xl font-bold text-[var(--color-text-primary)]">
        {t("empty.title")}
      </h1>

      <p className="mb-8 max-w-md text-[var(--color-text-secondary)]">
        {t("empty.description")}
      </p>

      <Link
        to="/shop"
        className="
          inline-flex
          items-center
          justify-center
          rounded-xl
          bg-[var(--color-primary)]
          px-6
          py-3
          font-semibold
          text-[var(--color-text-inverse)]
          transition-colors
          duration-[var(--duration-fast)]
          hover:bg-[var(--color-primary-hover)]
        "
      >
        {t("empty.continueShopping")}
      </Link>
    </main>
  );
}