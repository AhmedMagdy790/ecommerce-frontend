import type { IPagination } from "@/shared/types/pagination";

// payment-types.ts
export interface IPaymentGateway {
    id: number;
     name: ITranslatableField; 
    description?: ITranslatableField; 
    slug: string;
    logo: string | null;
    extra_fees: number;
    is_active: boolean;
    is_test_mode: boolean;
    sort_order: number;
    credentials: Record<string, any>; // هنا تخزن الـ API Keys
    created_at: string;
}

export interface ITranslatableField {
    ar: string;
    en: string;
}

export interface IPaymentGatewayPayload {
    // تم التغيير من string إلى ITranslatableField
    name: ITranslatableField; 
    description?: ITranslatableField; 
    
    slug: string;
    type: string;
    logo?: File | null;
    extra_fees?: number;
    is_active?: boolean;
    is_test_mode?: boolean;
    
    // يفضل تحديد هيكل الـ credentials بدلاً من Record<string, any> لزيادة الأمان
    credentials: {
        public_key?: string;
        secret_key?: string;
        [key: string]: any;
    };
}

export interface IPaymentGatewayState {
    gateways: IPaymentGateway[];
    isLoading: boolean;
    error: string | null;
    pagination: IPagination;

    // Actions
    fetchActiveGateways: () => Promise<void>;
    fetchAdminGateways: (filters?: any) => Promise<void>;
    getById: (id: number) => Promise<IPaymentGatewayPayload | null>;
    addGateway: (payload: IPaymentGatewayPayload) => Promise<boolean>;
    updateGateway: (id: number, payload: Partial<IPaymentGatewayPayload>) => Promise<boolean>;
    toggleGatewayStatus: (id: number) => Promise<void>;
    toggleGatewayTestMode: (id: number) => Promise<void>;
    deleteGateway: (id: number) => Promise<void>;
}