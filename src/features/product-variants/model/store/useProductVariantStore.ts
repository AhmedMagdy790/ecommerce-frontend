// src/features/product/store/useProductVariantStore.ts

import { createFeatureStore } from "@/shared/store/createFeatureStore";
import productVariantServices from "../../api/productVariant.service";
import { productVariantAdapter } from "../../adapters/productVariant.adapter";
import { DEFAULT_PRODUCT_VARIANT_FILTERS } from "../constants/productVariant.constants";

import type { 
  ProductVariantListResponse, 
  ProductVariantSingleResponse, 
  ProductVariantDeleteResponse, 
  CreateProductVariantDto, 
  UpdateProductVariantDto 
} from "../types/productVariant.api";
import type { ProductVariant, ProductVariantFilters, ProductVariantStatus } from "../types/productVariant.types";

// ======================================================
// Store
// ======================================================

export const useProductVariantStore = createFeatureStore<
  ProductVariant,
  CreateProductVariantDto,
  UpdateProductVariantDto,
  ProductVariantFilters,
  ProductVariantListResponse,
  ProductVariantSingleResponse,
  ProductVariantDeleteResponse,
  ProductVariantSingleResponse,
  ProductVariantListResponse,
  ProductVariantSingleResponse,
  ProductVariantDeleteResponse,
  Record<string, never>,
  ProductVariantStatus
>({
  name: "ProductVariantStore",

  service: productVariantServices,

  adapter: productVariantAdapter,

  defaultFilters: DEFAULT_PRODUCT_VARIANT_FILTERS,

  defaultSortBy: "id",


  toggle: {
    extractItem:
      productVariantAdapter.fromToggleResponse,

    getStatus: (item) =>
      item.status,

    getNextStatus: (currentStatus) => {
      if (currentStatus === "active") {
        return "inactive";
      }
      if (currentStatus === "inactive") {
        return "active";
      }
      return "active";
    },

    setStatus: (item, status) => ({
      ...item,
      status,
    }),

    errorMessage: "فشل تغيير حالة متغير المنتج",
  },

});