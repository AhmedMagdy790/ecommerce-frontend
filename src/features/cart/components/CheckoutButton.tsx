// src/pages/Cart/components/CheckoutButton.tsx

import { ArrowRight, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLang } from "@/shared/context/LanguageContext";

interface CheckoutButtonProps {
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export default function CheckoutButton({
  loading = false,
  disabled = false,
  onClick,
}: CheckoutButtonProps) {
  const { t } = useTranslation("cart");
  const { lang, isRTL } = useLang();

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || disabled}
      dir={isRTL ? "rtl" : "ltr"}
      className="
        flex
        w-full
        items-center
        justify-center
        gap-3
        rounded-card
        bg-primary
        px-8
        py-4
        text-base
        font-semibold
        text-text-inverse
        shadow-xl
        transition-all
        duration-[var(--duration-normal)]
        ease-[var(--ease-default)]
        hover:bg-primary-hover
        hover:scale-[1.01]
        active:scale-95
        disabled:cursor-not-allowed
        disabled:opacity-50
        disabled:scale-100
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-primary
      "
    >
      <span>
        {loading
          ? t("processing", { defaultValue: lang === "ar" ? "جاري المعالجة..." : "Processing..." })
          : t("checkout", { defaultValue: lang === "ar" ? "إتمام الشراء" : "Proceed to Checkout" })}
      </span>

      {!loading && (
        isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />
      )}
    </button>
  );
}