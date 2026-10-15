// src/hooks/useCartCalculations.ts

import type { ICartItem } from "@/features/cart/model/types/cart.types";
import { roundCurrency } from "@/shared/utils/currency";

export function useCartCalculations(
  items: ICartItem[] = [], 
  discountAmount: number = 0, 
  shippingCost: number = 0,
  taxRate: number = 0,
  paymentFee: number = 0 // 🟢 إضافة رسوم بوابة الدفع هنا
) {
  const rawSubtotal = items.reduce((acc, item: ICartItem) => {
    const price = Number(item.variant?.price ?? 0);
    const quantity = Number(item.quantity ?? 0);
    
    const itemTotal = item.item_total ?? (price * quantity);
    return acc + itemTotal;
  }, 0);

  const subtotal = roundCurrency(rawSubtotal);
  const shipping = subtotal === 0 ? 0 : Number(shippingCost);
  const payment = subtotal === 0 ? 0 : Number(paymentFee);

  // حساب الضريبة
  const tax = roundCurrency(subtotal * (taxRate / 100)); 

  // 🟢 المجموع الآن يشمل: الفرعي + الشحن + الضريبة + رسوم البوابة - الخصم
  const rawTotal = subtotal + shipping + payment + tax - discountAmount;
  const total = roundCurrency(Math.max(0, rawTotal));

  return {
    subtotal,
    shipping: roundCurrency(shipping),
    paymentFee: roundCurrency(payment),
    tax,
    discount: roundCurrency(discountAmount),
    total,
  };
}