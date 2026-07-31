import { useTranslation } from "react-i18next";

interface CartTotalsProps {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
}

export default function CartTotals({
  subtotal,
  shipping,
  tax,
  discount,
  total,
  currency,
}: CartTotalsProps) {
  const { t, i18n } = useTranslation("cart");

  const formatPrice = (value: number) =>
    new Intl.NumberFormat(i18n.language, {
      style: "currency",
      currency,
    }).format(value);

  return (
    <div className="space-y-4">
      <Row
        label={t("subtotal")}
        value={formatPrice(subtotal)}
      />

      <Row
        label={t("shipping")}
        value={formatPrice(shipping)}
      />

      <Row
        label={t("tax")}
        value={formatPrice(tax)}
      />

      {discount > 0 && (
        <Row
          label={t("discount")}
          value={`-${formatPrice(discount)}`}
          valueClassName="text-[var(--color-success)]"
        />
      )}

      <hr className="border-[var(--color-border)]" />

      <Row
        label={t("total")}
        value={formatPrice(total)}
        labelClassName="text-lg font-bold"
        valueClassName="text-lg font-bold"
      />
    </div>
  );
}

interface RowProps {
  label: string;
  value: string;
  labelClassName?: string;
  valueClassName?: string;
}

function Row({
  label,
  value,
  labelClassName,
  valueClassName,
}: RowProps) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={`text-[var(--color-text-secondary)] ${labelClassName ?? ""}`}
      >
        {label}
      </span>

      <span
        className={`font-medium ${valueClassName ?? ""}`}
      >
        {value}
      </span>
    </div>
  );
}