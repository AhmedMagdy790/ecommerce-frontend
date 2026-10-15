import type { Product } from "@/features/product/model/types/product.types";
import type { Section } from "@/features/cms/section/model/types/section.types";

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