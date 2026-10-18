import { createContext, useContext } from "react";

export interface ShippingCalculationContextValue {
  calculatingShipping: boolean;
  setCalculatingShipping: (loading: boolean) => void;
}

export const ShippingCalculationContext =
  createContext<ShippingCalculationContextValue | null>(null);

export function useShippingCalculation() {
  const context = useContext(ShippingCalculationContext);
  if (!context) {
    throw new Error("useShippingCalculation must be used within ShippingCalculationProvider");
  }
  return context;
}