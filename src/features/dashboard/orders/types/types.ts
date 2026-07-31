import type  { IUser } from "@/shared/types/userType";
import type { ICity } from "@/features/dashboard/city/types";



export type TOrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled' | 'returned';
export type TPaymentStatus = 'unpaid' | 'paid' | 'partially_refunded' | 'refunded'; 

export interface IOrderPayload {
    city: ICity;
    shipping_courier: string;
    payment_method: string;
    shipping_address: string;
    phone: number;
    notes: string;
    cancel_reason: string;
}


export interface IOrder {
    id?: number;
    name: string;
    user: IUser;
    city: ICity;
    shipping_courier: string;
    order_number: number;
    status: TOrderStatus;
    payment_status: string;
    sub_total: number;
    shipping_cost: number;
    discount_amount: number;
    total_amount: number;
    payment_method: string;
    shipping_address: string;
    phone: number;
    tracking_number: string;
    notes: string;
    cancel_reason: string;

    created_at?: string;
    updated_at?: string;
}


export interface IOrderState {
    // 📦 Data
    orders: IOrder[];
    adminOrders: IOrder[];
    trashedOrders: IOrder[];

    // ⚙️ UI State
    isLoading: boolean;
    error: string | null;

    // 🌐 Public
    getMyOrder: () => Promise<void>;

    // 🛠️ Admin
    fetchAdminOrders: () => Promise<void>;
    fetchTrashed: () => Promise<void>;

    // ➕ CRUD
    addOrder: (payload: IOrderPayload) => Promise<boolean>;
    updateOrder: (
        id: number,
        payload: Partial<IOrderPayload>
    ) => Promise<boolean>;

    deleteOrder: (id: number) => Promise<void>;
    restoreOrder: (id: number) => Promise<void>;

    // ⚡ Status
    updateOrderStatus: (
        id: number,
        status: IOrderState
    ) => Promise<void>;
}
