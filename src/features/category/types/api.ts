import type { Product } from "@/types/product";
import type { Section } from "@/types/sections";

export type CategoryStatus = 'active' | 'inactive' | string; // Adjust based on your CategoryStatus Enum values

export interface ApiCategory {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    status: CategoryStatus;
    parent_id: number | null;
    image: string | null;
    parent_category?: ApiCategory | null;
    children?: ApiCategory[];
    products?: Product[];
    sections?: Section[];
    created_at?: string;
    updated_at?: string;
}