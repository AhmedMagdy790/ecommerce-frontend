// shared/types/variant.ts

import type { ApiInventory } from "@/features/dashboard/inventory/types/api";

export type ProductVariantsStatus =
  | "active"
  | "inactive"
  | string;


export interface ApiVariant {

  id: number;

  product_id: number;

  sku: string;


  price: number | string;


  status: ProductVariantsStatus;


  attributes: Record<string, string> | null;


  weight: number | string | null;

  length: number | string | null;

  width: number | string | null;

  height: number | string | null;


  inventory?: ApiInventory;


  created_at?: string;

  updated_at?: string;
}