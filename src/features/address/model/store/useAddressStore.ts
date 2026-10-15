import { createFeatureStore } from "@/shared/store/createFeatureStore";

import addressServices from "../../api/address.service";
import { addressAdapter } from "../../adapters/address.adapter";

import type {
  PaginatedApiResponse,
  SuccessApiResponse,
} from "@/shared/types/api.types";


import type {
  Address,
  AddressFilters,
} from "../types/address.types";

import type {
  CreateAddressDto,
  UpdateAddressDto,
} from "../types/address.dto";

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
    void
  >({
    name: "AddressStore",

    service:
      addressServices,

    adapter:
      addressAdapter,

    defaultFilters:
      {},

    defaultSortBy:
      "id",
  });