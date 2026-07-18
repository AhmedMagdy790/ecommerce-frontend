import { Loader2, Lock, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PlaceOrderButtonProps {
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export default function PlaceOrderButton({
  loading = false,
  disabled = false,
  onClick,
}: PlaceOrderButtonProps) {
  const { t } = useTranslation("checkout");

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || disabled}
      className="
        w-full
        rounded-xl
        bg-[var(--color-primary)]
        px-6
        py-4
        text-[var(--color-text-inverse)]
        transition-colors
        duration-[var(--duration-fast)]
        hover:bg-[var(--color-primary-hover)]
        disabled:cursor-not-allowed
        disabled:opacity-60
      "
    >
      <span className="flex items-center justify-center gap-2">
        {loading ? (
          <>
            <Loader2
              size={18}
              className="animate-spin"
            />

            {t("placeOrder.processing")}
          </>
        ) : (
          <>
            <ShoppingBag size={18} />

            {t("placeOrder.button")}
          </>
        )}
      </span>

      {!loading && (
        <span
          className="
            mt-2
            flex
            items-center
            justify-center
            gap-1
            text-xs
            opacity-90
          "
        >
          <Lock size={14} />

          {t("placeOrder.secure")}
        </span>
      )}
    </button>
  );
}