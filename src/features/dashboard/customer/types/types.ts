import { type ICategory } from "@/features/dashboard/category/types/types";
import { type IProductVariant } from "@/features/dashboard/productsVariant/types/types";


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
    id: number;
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
    adminProducts: IProduct[];
    paginationType: 'client' | 'server';
    meta: {
        current_page: number | null,
        last_page: number | null,
        total: number | null,
    },
    trashedProducts: IProduct[];
    isLoading: boolean;
    error: string | null;
    fetchPublicProducts: () => Promise<void>;
    fetchAdminProducts: () => Promise<void>;
    fetchTrashed: () => Promise<void>;
    addProduct: (payload: IProductPayload) => Promise<boolean>;
    updateProduct: (id: number, payload: Partial<IProductPayload>) => Promise<boolean>;
    deleteProduct: (id: number) => Promise<void>;
    restoreProduct: (id: number) => Promise<void>;
    updateProductStatus: (id: number, status: TProductStatus ) => Promise<void>;
}
