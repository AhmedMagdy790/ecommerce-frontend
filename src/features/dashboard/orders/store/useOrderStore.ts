import { create } from "zustand";
import orderService from "../services/orderService";
import { type IOrderPayload, type IOrder } from "../types/types";

// تعريف الواجهة (Interface) للمتجر لضمان الـ Type Safety
interface OrderStoreActions {
    orders: IOrder[];
    adminOrders: IOrder[];
    trashedOrders: IOrder[];
    isLoading: boolean;
    error: string | null;
    getMyOrder: () => Promise<void>;
    getById: (id: number | string) => Promise<void>;
    fetchAdminOrders: () => Promise<void>;
    fetchTrashed: () => Promise<void>;
    addOrder: (payload: IOrderPayload) => Promise<IOrder>;
    updateOrder: (id: number, payload: Partial<IOrderPayload>) => Promise<boolean>;
    deleteOrder: (id: number) => Promise<void>;
    restoreOrder: (id: number) => Promise<void>;
    updateOrderStatus: (id: number, status: string) => Promise<void>;
    handleOrderCancelled: (orderId: number) => void;
    handleOrderUpdated: (order: IOrder) => void;
}

export const useOrderStore = create<OrderStoreActions>((set, get) => ({
    orders: [],
    adminOrders: [],
    trashedOrders: [],
    isLoading: false,
    error: null,

    getMyOrder: async () => {
        set({ isLoading: true });
        try {
            const data = await orderService.getMyOrders();
            set({ orders: data, error: null });
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ isLoading: false });
        }
    },


    getById: async (id) => {
        set({ isLoading: true });
        try {
            const data = await orderService.getById(id);
          
            set({ orders: Array.isArray(data) ? data : [data], error: null });
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchAdminOrders: async () => {
        set({ isLoading: true });
        try {
            const data = await orderService.getAllAdmin();
            set({ adminOrders: data, error: null });
        } catch (err: any) {
            set({ error: err.message });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    fetchTrashed: async () => {
        set({ isLoading: true });
        try {
            const data = await orderService.getTrashed();
            set({ trashedOrders: data || [], error: null });
        } catch (err: any) {
            set({ error: err.message });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    addOrder: async (payload) => {
        set({ isLoading: true });
        try {
            const newOrder = await orderService.create(payload);
            set((state) => ({
                orders: [newOrder, ...state.orders],
            }));
            return newOrder;
        } catch (err: any) {
            set({ error: err.message });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    updateOrder: async (id, payload) => {
        try {
            const updated = await orderService.update(id, payload);
            set((state) => ({
                adminOrders: state.adminOrders.map((o) => o.id === id ? updated : o),
                orders: state.orders.map((o) => o.id === id ? updated : o),
            }));
            return true;
        } catch (err: any) {
            set({ error: err.message });
            throw err;
        }
    },

    deleteOrder: async (id) => {
        try {
            await orderService.remove(id);
            set((state) => ({
                adminOrders: state.adminOrders.filter((o) => o.id !== id),
                orders: state.orders.filter((o) => o.id !== id),
            }));
        } catch (err: any) {
            set({ error: err.message });
            throw err;
        }
    },

    restoreOrder: async (id) => {
        try {
            const restored = await orderService.restore(id);
            set((state) => ({
                adminOrders: [restored, ...state.adminOrders],
                trashedOrders: state.trashedOrders.filter((o) => o.id !== id),
            }));
        } catch (err: any) {
            set({ error: err.message });
            throw err;
        }
    },
    


    updateOrderStatus: async (id, status) => {
        set({ isLoading: true });
        try {
            const updatedOrder = await orderService.updateStatus(id, status);
            // تحديث الطلب في القائمة فوراً
            set((state) => ({
                adminOrders: state.adminOrders.map((o) => 
                    o.id === id ? { ...o, status: updatedOrder.status } : o
                ),
            }));
        } catch (err: any) {
            set({ error: err.message });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },


    handleOrderCancelled: (orderId) => set((state) => ({
        adminOrders: state.adminOrders.filter((o) => o.id !== orderId),
        orders: state.orders.filter((o) => o.id !== orderId),
    })),

    handleOrderUpdated: (updatedOrder) => set((state) => ({
        adminOrders: state.adminOrders.map((o) => o.id === updatedOrder.id ? updatedOrder : o),
        orders: state.orders.map((o) => o.id === updatedOrder.id ? updatedOrder : o),
    })),
}));