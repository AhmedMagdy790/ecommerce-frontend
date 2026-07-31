import { type ProductVariantFormData } from "../schema/productVariantSchema";


export interface IProductVariant {
    id?: number;
    sku: string;
    price: number;
    stock: number;
    status: string;
    attributes?: Record<string, any>;
}


export interface IProductVariantState {
    variants: IProductVariant[];
    paginationType: "client" | "server",
    meta: {
        current_page: number | null,
        last_page: number | null,
        total: number | null,
    },
    isLoading: boolean;
    error: string | null;

    // actions
    fetchByProduct: (productId: number) => Promise<void>;
    fetchAdminVariants: (filters: any) => Promise<void>;
    addVariant: (productId: number, data: ProductVariantFormData) => Promise<void>;
    updateVariant: (id: number, data: Partial<ProductVariantFormData>) => Promise<void>;
    updateStock: (id: number, stock: number) => Promise<void>;
    deleteVariant: (id: number) => Promise<void>;
    restoreVariant: (id: number) => Promise<void>;
}