import type { ProductVariant } from "@/types/product";

export interface ApiInventory {
    id: number;
    product_variant_id: number;
    stock_quantity: number;
    reserved_quantity: number;
    product_variant?: ProductVariant;
    created_at?: string;
    updated_at?: string;
}