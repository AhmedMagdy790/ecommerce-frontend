import type { PaginatedApiResponse, PaginationMeta, SuccessApiResponse } from "@/shared/types/api.types";
import type { InventoryFormData } from "../model/schema/inventorySchema";
import { extractStatsSafely } from "@/shared/utils/helper";
import type { Inventory, InventoryStats } from "../model/types/inventory.types";

export const inventoryAdapter = {

  fromListResponse(response: PaginatedApiResponse<Inventory>): Inventory[] {
    return response.data.items;
  },

  fromCreateResponse(response: SuccessApiResponse<{ inventory: Inventory }>): Inventory {
    return response.data.inventory;
  },

  fromUpdateResponse(response: SuccessApiResponse<{ inventory: Inventory }>): Inventory {
    return response.data.inventory;
  },

  fromToggleResponse(response: SuccessApiResponse<{ inventory: Inventory }>): Inventory {
    return response.data.inventory;
  },

  extractPagination(response: PaginatedApiResponse<Inventory>): PaginationMeta {
    return response.data.pagination ?? {
      type: "server",
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
    };
  },

  extractStats(response: PaginatedApiResponse<Inventory>): InventoryStats {
    return extractStatsSafely(
      (response.data as PaginatedApiResponse<Inventory>["data"] & { stats?: InventoryStats }).stats,
      {
      total: 0,
      in_stock: 0,
      low_stock: 0,
      out_of_stock: 0,
      }
    );
  },
    
  /**
   * Transforms form input into payload for creating an inventory record.
   */
  toCreateDto(data: InventoryFormData) {
    return {
      product_variant_id: data.product_variant_id,
      stock_quantity: data.stock_quantity,
      reserved_quantity: data.reserved_quantity,
    };
  },

  /**
   * Transforms form input into payload for updating an inventory record.
   */
  toUpdateDto(data: InventoryFormData) {
    return {
      product_variant_id: data.product_variant_id,
      stock_quantity: data.stock_quantity,
      reserved_quantity: data.reserved_quantity,
    };
  },
};