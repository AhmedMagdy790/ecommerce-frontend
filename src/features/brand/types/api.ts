import type { Product } from "@/types/product";
import type { Section } from "@/types/sections";

export interface ApiBrand {
    id: number;
    name: string;
    slug: string;
    website: string | null;
    logo: string | null;
    is_active: boolean;
    products?: Product[];
    sections?: Section[];
    created_at?: string;
    updated_at?: string;
}