import { ShippingCalculationContext } from "@/features/checkout/hooks/useShippingCalculation";
import { useState, type ReactNode } from "react";


export function ShippingCalculationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [calculatingShipping, setCalculatingShipping] = useState(false);

  return (
    <ShippingCalculationContext.Provider
      value={{ calculatingShipping, setCalculatingShipping }}
    >
      {children}
    </ShippingCalculationContext.Provider>
  );
}