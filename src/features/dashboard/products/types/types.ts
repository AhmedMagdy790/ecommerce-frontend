import { type ICategory } from "@/features/dashboard/category/types/types";
import { type IProductVariant } from "@/features/dashboard/productsVariant/types/types";
import type { IPagination } from "@/shared/types/pagination";


export type TProductStatus = "active" | "archived" | "draft"

export interface IProductPayload {
    name: string;
    category_id: number;
    description?: string;
    brand?: string;
    status: TProductStatus;
    featured_image?: File | null;
    gallery?: File[];
    variants: IProductVariant[];
    remove_images?: number[];
}


export interface IProduct {
    id: number | string;
    name: string;
    slug: string;
    description: string;
    brand?: string;
    category: ICategory;
    status: TProductStatus;
    created_at?: string;
    updated_at?: string;
}


export interface IProductState {
    products: IProduct[];
    pagination: IPagination;
    trashedProducts: IProduct[];
    isLoading: boolean;
    error: string | null;
    fetchAdminProducts: () => Promise<void>;
    fetchTrashed: () => Promise<void>;
    addProduct: (payload: IProductPayload) => Promise<boolean>;
    updateProduct: (id: number, payload: Partial<IProductPayload>) => Promise<boolean>;
    deleteProduct: (id: number) => Promise<void>;
    restoreProduct: (id: number) => Promise<void>;
    updateProductStatus: (id: number, status: TProductStatus ) => Promise<void>;
}
