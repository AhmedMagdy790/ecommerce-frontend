import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

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

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || disabled}
      className="
        flex
        w-full
        items-center
        justify-center
        gap-2
        rounded-xl
        bg-[var(--color-primary)]
        px-6
        py-3
        font-semibold
        text-[var(--color-text-inverse)]
        transition-colors
        duration-[var(--duration-fast)]
        hover:bg-[var(--color-primary-hover)]
        disabled:cursor-not-allowed
        disabled:opacity-60
      "
    >
      <span>
        {loading
          ? t("processing")
          : t("checkout")}
      </span>

      {!loading && <ArrowRight size={18} />}
    </button>
  );
}