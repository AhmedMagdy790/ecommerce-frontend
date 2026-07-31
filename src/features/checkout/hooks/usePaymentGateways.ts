// src/pages/Checkout/hooks/usePaymentGateways.ts

import { useState, useEffect } from "react";
import { paymentService } from "@/services/paymentService";
import type { PaymentGateway } from "@/shared/types/payment";

export function usePaymentGateways() {
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchGateways() {
      try {
        setLoading(true);
        const data = await paymentService.getPaymentGateways();
        if (isMounted) {
          setGateways(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load payment gateways");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchGateways();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    gateways,
    loading,
    error,
  };
}