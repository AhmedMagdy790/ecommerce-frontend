// src/pages/Checkout/hooks/useCheckoutForm.ts

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCart } from "@/pages/Cart/hook/useCart";
import { checkoutFormSchema, type CheckoutFormValues } from "../types/checkout";

export function useCheckoutForm() {
  const { cartItems } = useCart();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    mode: "onChange",
    defaultValues: {
      idempotency_key: crypto.randomUUID(),
      customer_name: "",
      customer_type: "individual",
      phone_primary: "",
      phone_secondary: "",
      shipping_address2: "",
      customer_email: "",
      shipping_address: "",
      city_id: undefined,
      shipping_rate_id: undefined,
      payment_method: "cash_on_delivery",
      items: cartItems?.map((item) => ({
        product_variant_id: Number(item.product_variant_id ?? item.variant?.id ?? item.id),
        quantity: Number(item.quantity ?? 1),
      })) ?? [],
      coupon_code: "",
      notes: "",
    },
  });

  // Sync items when cartItems load asynchronously or change
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const formattedItems = cartItems.map((item) => ({
        product_variant_id: Number(item.product_variant_id ?? item.variant?.id ?? item.id),
        quantity: Number(item.quantity ?? 1),
      }));

      form.setValue("items", formattedItems, { shouldValidate: true });
    }
  }, [cartItems, form]);

  return form;
}