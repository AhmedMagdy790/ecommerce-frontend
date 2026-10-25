// src/pages/Cart/components/CartTotals.tsx

import { useTranslation } from "react-i18next";
import { useLang } from "@/shared/context/LanguageContext";

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
  const { isRTL, lang } = useLang();

  const formatPrice = (value: number) =>
    new Intl.NumberFormat(i18n.language, {
      style: "currency",
      currency,
    }).format(value);

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="space-y-4">
      <Row
        label={t("subtotal", { defaultValue: lang === "ar" ? "المجموع الفرعي" : "Subtotal" })}
        value={formatPrice(subtotal)}
      />

      <Row
        label={t("shipping", { defaultValue: lang === "ar" ? "الشحن" : "Shipping" })}
        value={formatPrice(shipping)}
      />

      <Row
        label={t("tax", { defaultValue: lang === "ar" ? "الضريبة" : "Tax" })}
        value={formatPrice(tax)}
      />

      {discount > 0 && (
        <Row
          label={t("discount", { defaultValue: lang === "ar" ? "الخصم" : "Discount" })}
          value={`-${formatPrice(discount)}`}
          valueClassName="text-emerald-600 dark:text-emerald-400 font-semibold"
        />
      )}

      <hr className="border-border" />

      <Row
        label={t("total", { defaultValue: lang === "ar" ? "الإجمالي الكلي" : "Total" })}
        value={formatPrice(total)}
        labelClassName="text-lg font-bold text-text-primary"
        valueClassName="text-lg font-bold text-primary"
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
        className={`text-text-secondary ${labelClassName ?? ""}`}
      >
        {label}
      </span>

      <span
        className={`font-medium text-text-primary ${valueClassName ?? ""}`}
      >
        {value}
      </span>
    </div>
  );
}