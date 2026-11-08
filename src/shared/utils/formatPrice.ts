interface FormatPriceOptions {
  currency?: string;
  lang?: string;
}

export function formatPrice(
  amount: number | string | null | undefined,
  options: FormatPriceOptions = {}
): string {
  if (amount === null || amount === undefined || amount === "") return "";

  const numericAmount = typeof amount === "number" ? amount : Number(amount);
  if (isNaN(numericAmount)) return "";

  const { currency = "EGP", lang = "ar" } = options;

  try {
    return new Intl.NumberFormat(lang, {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(numericAmount);
  } catch (error: unknown) {
    void error;
    return new Intl.NumberFormat("ar", {
      style: "currency",
      currency: "EGP",
    }).format(numericAmount);
  }
}