// src/pages/Checkout/components/CheckoutGuard.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useCart } from "@/pages/Cart/hook/useCart";
import CheckoutLoading from "./CheckoutLoading";

export function CheckoutGuard() {
  const { cartItems, isLoading: isCartLoading } = useCart();

  if (isCartLoading) {
    return <CheckoutLoading />;
  }

  if (!cartItems?.length) {
    return <Navigate to="/cart" replace />;
  }

  return <Outlet />;
}