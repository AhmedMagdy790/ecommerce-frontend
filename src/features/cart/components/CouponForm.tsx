import { useState } from "react";
import { TicketPercent } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CouponFormProps {
  loading?: boolean;
  onApply?: (code: string) => void;
}

export default function CouponForm({
  loading = false,
  onApply,
}: CouponFormProps) {
  const { t } = useTranslation("cart");

  const [code, setCode] = useState("");

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const coupon = code.trim();

    if (!coupon) {
      return;
    }

    onApply?.(coupon);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        rounded-xl
        border
        border-[var(--color-border)]
        bg-[var(--color-background)]
        p-4
      "
    >
      <label
        htmlFor="coupon"
        className="mb-2 flex items-center gap-2 font-medium"
      >
        <TicketPercent size={18} />

        {t("coupon.title")}
      </label>

      <div className="flex gap-3">
        <input
          id="coupon"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={t("coupon.placeholder")}
          disabled={loading}
          className="
            flex-1
            rounded-lg
            border
            border-[var(--color-border)]
            bg-[var(--color-background)]
            px-4
            py-2
            outline-none
            transition-colors
            focus:border-[var(--color-primary)]
          "
        />

        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="
            rounded-lg
            bg-[var(--color-primary)]
            px-5
            py-2
            font-medium
            text-[var(--color-text-inverse)]
            transition-colors
            hover:bg-[var(--color-primary-hover)]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading
            ? t("coupon.applying")
            : t("coupon.apply")}
        </button>
      </div>
    </form>
  );
}