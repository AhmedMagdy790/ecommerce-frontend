// src/features/address/model/store/address.store.ts

import { createFeatureStore } from "@/shared/store/createFeatureStore";

import addressServices from "../../api/address.service";
import { addressAdapter } from "../../adapters/address.adapter";

import type {
  PaginatedApiResponse,
  SuccessApiResponse,
} from "@/shared/types/api.types";

import {
  createAddressActions,
  type AddressCustomActions,
} from "../../model/store/address.actions";

import type {
  Address,
  AddressFilters,
} from "../../model/types/address.types";

import type {
  CreateAddressDto,
  UpdateAddressDto,
} from "../../model/types/address.dto";

// ======================================================
// Store
// ======================================================

export const useAddressStore =
  createFeatureStore<
    Address,
    CreateAddressDto,
    UpdateAddressDto,
    AddressFilters,
    PaginatedApiResponse<Address>,
    SuccessApiResponse<{ address: Address }>,
    SuccessApiResponse<null>,
    SuccessApiResponse<{ address: Address }>,
    void,
    void,
    void,
    AddressCustomActions
  >({
    name: "AddressStore",

    // ==================================================
    // Service
    // ==================================================

    service:
      addressServices,

    // ==================================================
    // Adapter
    // ==================================================

    adapter:
      addressAdapter,

    // ==================================================
    // Table
    // ==================================================

    defaultFilters:
      {},

    defaultSortBy:
      "id",

    // ==================================================
    // Custom Actions
    // ==================================================

    customActions:
      createAddressActions,
  });