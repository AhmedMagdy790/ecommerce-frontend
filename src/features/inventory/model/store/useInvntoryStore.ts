// src/features/inventory/store/inventory.store.ts

import { createFeatureStore } from "@/shared/store/createFeatureStore";

import inventoryServices from "../../api/inventoryServices";
import { inventoryAdapter } from "../../adapters/inventory.adapter";

import type {
  Inventory,
  InventoryFilters,
  InventoryStats,
} from "../types/inventory.types";

import type {
  CreateInventoryDto,
  UpdateInventoryDto,
} from "../types/inventory.dto";

import type {
  InventoryDeleteResponse,
  InventoryListResponse,
  InventorySingleResponse,
} from "../types/inventory.api";
import { inventoryStatsHooks } from "./invntoryStatusHooks";



// ======================================================
// Store
// ======================================================

export const useInventoryStore =
  createFeatureStore<
    Inventory,
    CreateInventoryDto,
    UpdateInventoryDto,
    InventoryFilters,
    InventoryListResponse,
    InventorySingleResponse,
    InventoryDeleteResponse,
    InventorySingleResponse,
    void,
    void,
    void,
    Record<string, never>,
    InventoryStats
  >({
    name: "InventoryStore",

    // ==================================================
    // Service
    // ==================================================

    service:
      inventoryServices,

    // ==================================================
    // Adapter
    // ==================================================

    adapter:
      inventoryAdapter,

    // ==================================================
    // Table
    // ==================================================

    defaultFilters:
      {},

    defaultSortBy:
      "id",

    hooks: {
      onFetched: (response) => {
        const stats =
          inventoryAdapter.extractStats(response);

        inventoryStatsHooks.onFetched(stats);
      },

      onCreated:
        inventoryStatsHooks.onCreated,

      onDeleted:
        inventoryStatsHooks.onDeleted,
    }
  });