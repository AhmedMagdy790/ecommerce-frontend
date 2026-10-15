import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function CheckoutLoading() {
  const { t } = useTranslation("checkout");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)]">
      <div className="flex flex-col items-center gap-3 text-[var(--color-text-secondary)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />

        <p className="text-sm">
          {t("loading.cart", "Loading your cart...")}
        </p>
      </div>
    </div>
  );
}