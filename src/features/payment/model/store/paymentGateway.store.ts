// src/features/payment/store/paymentGateway.store.ts

import { createFeatureStore } from "@/shared/store/createFeatureStore";
import paymentGatewayService from "../../api/paymentGateway.service";
import { paymentGatewayAdapter } from "../../adapters/paymentGateway.adapter";
import type { 
  PaymentGateway, 
  PaymentGatewayFilters
} from "../types/payment.types";

import type { 
  CreatePaymentGatewayDto, 
  UpdatePaymentGatewayDto 
} from "../types/payment.dto";

import type { 
  PaymentGatewayDeleteResponse,
  PaymentGatewayListResponse,
  PaymentGatewaySingleResponse 
} from "../types/payment.api";


import { paymentGatewayStatsHooks } from "./paymentGatewayStatsHooks";

export const usePaymentGatewayStore = createFeatureStore<
  PaymentGateway,                  // TModel
  CreatePaymentGatewayDto,         // TCreateDto
  UpdatePaymentGatewayDto,         // TUpdateDto
  PaymentGatewayFilters,           // TFilters
  PaymentGatewayListResponse,      // TListRes
  PaymentGatewaySingleResponse,    // TSingleRes
  PaymentGatewayDeleteResponse,    // TDeleteRes
  PaymentGatewaySingleResponse,    // TUpdateRes
  PaymentGatewayListResponse,      // TTrashRes
  PaymentGatewaySingleResponse,    // TRestoreRes
  PaymentGatewayDeleteResponse,    // TForceDeleteRes
  Record<string, never>,            // TCustomState
  boolean                     // TStats
>({
  name: "PaymentGatewayStore",

  service: paymentGatewayService,

  adapter: paymentGatewayAdapter,

  defaultFilters: {
    search: "",
    is_active: "",
  },

  defaultSortBy: "created_at",

  hooks: {
    onFetched: (response) => {
      const stats =
        paymentGatewayAdapter.extractStats(response);

      paymentGatewayStatsHooks.onFetched(stats);
    },

    onCreated:
      paymentGatewayStatsHooks.onCreated,

    onDeleted:
      paymentGatewayStatsHooks.onDeleted,
  },

  
  toggle: {
    extractItem:
      paymentGatewayAdapter.fromToggleResponse,

    getStatus: (item) =>
      item.is_active ?? false,

    getNextStatus: (
      currentStatus,
    ) => !currentStatus,

    setStatus: (
      item,
      status,
    ) => ({
      ...item,
      is_active: status,
    }),

    onChanged: (
        item,
        previousStatus
      ) => {
        paymentGatewayStatsHooks.onToggled(
          item,
          previousStatus,
        );
      },
  

    errorMessage:
      "فشل تغيير حالة بوابة الدفع",
  },

});