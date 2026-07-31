// src/hooks/useCartCalculations.ts

import { roundCurrency } from "@/shared/utils/currency";
import type { ICartItem, CartTotals } from "@/features/cart/types";

export function useCartCalculations(
  items: ICartItem[] = [], 
  discountAmount: number = 0, 
  shippingCost: number = 0,
  taxRate: number = 0
): CartTotals {
  


  const rawSubtotal = items.reduce((acc, item: ICartItem) => {
    const itemTotal = item.item_total ?? (item.variant?.price ?? 0) * (item.quantity ?? 0);
    return acc + itemTotal;
  }, 0);

  const subtotal = roundCurrency(rawSubtotal);
  const shipping = subtotal === 0 ? 0 : Number(shippingCost);

  // حساب الضريبة (إذا كانت نسبة مئوية مثلاً، أو قيمة ثابتة)
  const tax = roundCurrency(subtotal * (taxRate / 100)); 

  const rawTotal = subtotal + shipping + tax - discountAmount;
  const total = roundCurrency(Math.max(0, rawTotal));

  return {
    subtotal,
    shipping: roundCurrency(shipping),
    tax,
    discount: roundCurrency(discountAmount),
    total,
  };
}