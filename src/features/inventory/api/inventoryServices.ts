import { adminApi } from "@/api/client";

import type { 
  PaginatedApiResponse, 
  SuccessApiResponse 
} from "@/shared/types/api.types";
import type { Inventory, InventoryFilters } from "../model/types/inventory.types";
import type { CreateInventoryDto, UpdateInventoryDto } from "../model/types/inventory.dto";

export const inventoryServices = {

  getAll(params?: InventoryFilters) {
    return adminApi.getInventories<PaginatedApiResponse<Inventory>, InventoryFilters>(params);
  },

  getById(id: number | string) {
    return adminApi.getInventoryById<SuccessApiResponse<{ inventory: Inventory }>>(id);
  },

  create(payload: CreateInventoryDto) {
    return adminApi.createInventory<SuccessApiResponse<{ inventory: Inventory }>, CreateInventoryDto>(
      payload
    );
  },

  update(id: number | string, payload: UpdateInventoryDto) {
    return adminApi.updateInventory<SuccessApiResponse<{ inventory: Inventory }>, UpdateInventoryDto>(
      id, 
      payload
    );
  },

  delete(id: number | string) {
    return adminApi.deleteInventory<SuccessApiResponse<null>>(id);
  },

};

export default inventoryServices;