import { useState } from "react";
import { Truck } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ShippingCalculatorProps {
  loading?: boolean;
  onCalculate?: (
    country: string,
    city: string
  ) => void;
}

export default function ShippingCalculator({
  loading = false,
  onCalculate,
}: ShippingCalculatorProps) {
  const { t } = useTranslation("cart");

  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!country || !city) {
      return;
    }

    onCalculate?.(country, city);
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
      <div className="mb-4 flex items-center gap-2">
        <Truck size={18} />

        <h2 className="font-semibold">
          {t("shipping.title")}
        </h2>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder={t("shipping.country")}
          disabled={loading}
          className="
            w-full
            rounded-lg
            border
            border-[var(--color-border)]
            px-4
            py-2
            outline-none
            focus:border-[var(--color-primary)]
          "
        />

        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder={t("shipping.city")}
          disabled={loading}
          className="
            w-full
            rounded-lg
            border
            border-[var(--color-border)]
            px-4
            py-2
            outline-none
            focus:border-[var(--color-primary)]
          "
        />

        <button
          type="submit"
          disabled={
            loading ||
            !country.trim() ||
            !city.trim()
          }
          className="
            w-full
            rounded-lg
            bg-[var(--color-primary)]
            px-4
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
            ? t("shipping.calculating")
            : t("shipping.calculate")}
        </button>
      </div>
    </form>
  );
}