import { create } from "zustand";
import customerService from "../services/customerService";
import { useStatusStore } from "@/shared/components/StatusOverlay/statusStore";
import { type IUser } from "@/shared/types/userType";


const { show, hide } = useStatusStore.getState();

interface ICustomerState {
    customers: IUser[];
    paginationType: 'client' | 'server';
    meta: {
        current_page: number;
        last_page: number | null;
        total: number | null;
    };
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchCustomers: (filters?: any) => Promise<void>;
    addCustomer: (payload: any) => Promise<IUser | null>;
    updateCustomer: (id: number | string, payload: any) => Promise<boolean>;
    deleteCustomer: (id: number | string) => Promise<void>;
}

export const useCustomerStore = create<ICustomerState>((set, get) => ({
    customers: [],
    paginationType: 'client',
    meta: {
        current_page: 1,
        last_page: null,
        total: null
    },
    isLoading: false,
    error: null,

    // 🌐 جلب العملاء
    fetchCustomers: async (filters = {}) => {
        set({ isLoading: true });
        try {
            const data = await customerService.getAll(filters);
            
            const { items, pagination_type, total } = data;

            set({ 
                customers: items,
                paginationType: pagination_type,
                meta: {
                    ...get().meta,
                    total: total
                },
                error: null 
            });
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ isLoading: false });
        }
    },

    // ➕ إضافة عميل جديد
    addCustomer: async (payload) => {
        show("loading", "جاري إضافة العميل...");
        try {
            const newCustomer = await customerService.create(payload);
            
            set((state) => ({
                customers: [newCustomer, ...state.customers],
            }));

            show("success", "تم إضافة العميل بنجاح");
            return newCustomer; // نرجعه لاستخدامه في صفحة الطلبات إذا لزم الأمر
        } catch (err: any) {
            set({ error: err.message });
            show("error", "فشل إضافة العميل");
            throw err;
        } finally {
            setTimeout(() => hide(), 1500);
        }
    },

    // ✏️ تحديث بيانات عميل
    updateCustomer: async (id, payload) => {
        show("loading", "جاري حفظ التعديلات...");
        try {
            const updated = await customerService.update(id, payload);

            set((state) => ({
                customers: state.customers.map((c) =>
                    c.id === id ? updated : c
                ),
            }));

            show("success", "تم تحديث بيانات العميل");
            return true;
        } catch (err: any) {
        
            set({ error: err.message });
            show("error", "فشل التحديث");
            throw err;
        } finally {
            setTimeout(() => hide(), 1500);
        }
    },

    // 🗑️ حذف عميل
    deleteCustomer: async (id) => {
        show("loading", "جاري حذف العميل...");
        try {
            await customerService.remove(id);
            
            set((state) => ({
                customers: state.customers.filter((c) => c.id !== id),
            }));

            show("success", "تم الحذف بنجاح");
        } catch (err: any) {
            show("error", "فشل الحذف");
            throw err;
        } finally {
            setTimeout(() => hide(), 1000);
        }
    },
}));