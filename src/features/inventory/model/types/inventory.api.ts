import type { PaginatedApiResponse, SuccessApiResponse } from "@/shared/types/api.types";
import type { Inventory } from "./inventory.types";

export type InventoryListResponse = PaginatedApiResponse<Inventory>;
export type InventorySingleResponse = SuccessApiResponse<{ inventory: Inventory }>;
export type InventoryDeleteResponse = SuccessApiResponse<null>;