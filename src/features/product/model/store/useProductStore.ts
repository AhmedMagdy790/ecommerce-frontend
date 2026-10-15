// src/features/product/store/useProductStore.ts

import { createFeatureStore } from "@/shared/store/createFeatureStore";
import productService from "../../api/product.service";
import { productAdapter } from "@/features/product/adapters/product.adapter";
import { DEFAULT_PRODUCT_FILTERS } from "../constants/product.constants";
import { productStatusHooks } from "./productStatusHooks";

import type { 
  ProductListResponse, 
  ProductSingleResponse, 
  ProductDeleteResponse,
  ProductRestoreResponse 
} from "../types/product.api";
import { ProductStatus, type Product, type ProductFilters } from "../types/product.types";
import type { TranslatedText } from "@/shared/types/types";
import type { CreateProductDto, UpdateProductDto } from "../types/product.dto";

// ======================================================
// Store
// ======================================================

export const useProductStore = createFeatureStore<
  Product<TranslatedText>,
  CreateProductDto,
  UpdateProductDto,
  ProductFilters,
  ProductListResponse,
  ProductSingleResponse,
  ProductDeleteResponse,
  ProductSingleResponse,
  ProductListResponse,
  ProductRestoreResponse,
  ProductDeleteResponse,
  Record<string, never>,
  ProductStatus
>({
  name: "ProductStore",

  service: productService,

  adapter: productAdapter,

  defaultFilters: DEFAULT_PRODUCT_FILTERS,

  defaultSortBy: "createdAt",

  hooks: {
    onFetched: (response) => {
      const stats =
        productAdapter.extractStats(response);

      productStatusHooks.onFetched(stats);
    },

    onCreated:
      productStatusHooks.onCreated,

    onDeleted:
      productStatusHooks.onDeleted,

    onTrashed:
      productStatusHooks.onDeleted,

    onRestored:
      productStatusHooks.onRestored,

    onForceDeleted:
      productStatusHooks.onForceDeleted,
  },

  // ====================================================
  // Toggle
  // ====================================================

toggle: {
    extractItem:
      productAdapter.fromToggleResponse,

    getStatus: (item) =>
      item.status,

    getNextStatus: (
      currentStatus,
    ) => {
      if (
        currentStatus ===
        ProductStatus.ACTIVE
      ) {
        return ProductStatus.ARCHIVED;
      }

      return ProductStatus.ACTIVE;
    },

    setStatus: (
      item,
      status,
    ) => ({
      ...item,
      status,
    }),

    onChanged: (item, previousStatus) => {
      productStatusHooks.onToggled(item, previousStatus);
    },

    errorMessage:
      "فشل تغيير حالة المنتج",
  },
});