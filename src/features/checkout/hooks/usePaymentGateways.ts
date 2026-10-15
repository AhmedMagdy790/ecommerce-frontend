// src/pages/Checkout/hooks/usePaymentGateways.ts

import { useState, useEffect } from "react";
import { paymentService } from "@/services/paymentService";
import type { PaymentGateway } from "@/features/payment/model/types/payment.types";


export function usePaymentGateways() {
  const [gateways, setGateways] = useState<PaymentGateway<string>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchGateways() {
      try {
        setLoading(true);
        const gateways = await paymentService.getPaymentGateways();
        if (isMounted) {
          setGateways(gateways ?? []);
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