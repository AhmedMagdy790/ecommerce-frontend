// تعريف واجهة إعدادات العملة (يمكن جلبها من الـ Settings API أو الـ Form)
export interface CurrencySettings {
  currency?: string;          // مثل USD, EGP, SAR
  currencySymbol?: string;    // مثل $, ج.م, ر.س
  decimals?: number;          // عدد الخانات العشرية (افتراضياً 2)
}

/**
 * تنسيق المبلغ مع دعم الرمز والإعدادات
 */
export function formatCurrency(
  amount: number | string | undefined | null, 
  settingsOrSymbol: string | CurrencySettings = "$"
): string {
  const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  
  if (numericAmount === undefined || numericAmount === null || isNaN(numericAmount)) {
    return `${getSymbol(settingsOrSymbol)}0.00`;
  }

  const symbol = getSymbol(settingsOrSymbol);
  const decimals = getDecimals(settingsOrSymbol);

  return `${symbol}${numericAmount.toFixed(decimals)}`;
}

/**
 * تقريب المبلغ لتجنب مشاكل الفاصلة العائمة
 */
export function roundCurrency(amount: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round((amount + Number.EPSILON) * factor) / factor;
}

// دالة مساعدة استخراج الرمز
function getSymbol(settingsOrSymbol: string | CurrencySettings): string {
  if (typeof settingsOrSymbol === "string") {
    return settingsOrSymbol;
  }
  return settingsOrSymbol.currencySymbol || settingsOrSymbol.currency || "$";
}

// دالة مساعدة استخراج عدد الخانات العشرية
function getDecimals(settingsOrSymbol: string | CurrencySettings): number {
  if (typeof settingsOrSymbol === "object" && settingsOrSymbol.decimals !== undefined) {
    return settingsOrSymbol.decimals;
  }
  return 2;
}