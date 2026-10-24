import { useState, useEffect } from "react";
import { paymentService } from "@/services/paymentService";
import type { PaymentGateway } from "@/features/payment/model/types/payment.types";

export function usePaymentGateways(countryId: number | null) {
  const [gateways, setGateways] = useState<PaymentGateway<string>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (countryId == null) return;

    let isActive = true;

    async function fetchGateways() {
      setLoading(true);
      setError(null);


      try {
        const result =
          await paymentService.getPaymentGateways(Number(countryId));

        if (isActive) {
          setGateways(result ?? []);
        }
      } catch (err) {
        if (isActive) {
          setGateways([]);
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load payment gateways",
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    fetchGateways();

    return () => {
      isActive = false;
    };
  }, [countryId]);

  return {
    gateways: countryId == null ? [] : gateways,
    loading: countryId != null && loading,
    error: countryId == null ? null : error,
  };
}