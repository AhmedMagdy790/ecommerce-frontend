import { useCallback, useEffect, useState } from "react";

import type { Address } from "../model/types/address.types";
import type {
  CreateAddressDto,
  UpdateAddressDto,
} from "../model/types/address.dto";

import addressServices from "../api/address.service";

interface UseAddressPageResult {
  addresses: Address[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createAddress: (payload: CreateAddressDto) => Promise<boolean>;
  updateAddress: (
    id: Address["id"],
    payload: UpdateAddressDto,
  ) => Promise<boolean>;
  setDefaultAddress: (id: Address["id"]) => Promise<boolean>;
  deleteAddress: (id: Address["id"]) => Promise<boolean>;
}

export function useAddressPage(): UseAddressPageResult {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await addressServices.getAll();

      // عدّل المسار حسب شكل الاستجابة الحقيقي من Laravel.
      setAddresses(response.data.items);
    } catch {
      setError("تعذر تحميل العناوين. حاول مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const runMutation = useCallback(
    async (operation: () => Promise<unknown>): Promise<boolean> => {
      setIsSubmitting(true);
      setError(null);

      try {
        await operation();
      } catch {
        setError("تعذر تنفيذ العملية. حاول مرة أخرى.");
        setIsSubmitting(false);
        return false;
      }

      // نجاح العملية لا يعني بالضرورة نجاح إعادة تحميل القائمة.
      await refresh();
      setIsSubmitting(false);

      return true;
    },
    [refresh],
  );

  const createAddress = useCallback(
    (payload: CreateAddressDto) =>
      runMutation(() => addressServices.create(payload)),
    [runMutation],
  );

  const updateAddress = useCallback(
    (id: Address["id"], payload: UpdateAddressDto) =>
      runMutation(() => addressServices.update(id, payload)),
    [runMutation],
  );

  const setDefaultAddress = useCallback(
    (id: Address["id"]) =>
      runMutation(() => addressServices.setDefault(id)),
    [runMutation],
  );

  const deleteAddress = useCallback(
    (id: Address["id"]) =>
      runMutation(() => addressServices.delete(id)),
    [runMutation],
  );

  return {
    addresses,
    isLoading,
    isSubmitting,
    error,
    refresh,
    createAddress,
    updateAddress,
    setDefaultAddress,
    deleteAddress,
  };
}