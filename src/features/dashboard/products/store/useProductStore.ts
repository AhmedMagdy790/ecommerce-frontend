import { create } from "zustand";
import productService from "../services/productService";
import { type IProductState } from "../types/types";
import { useStatusStore } from "@/shared/components/StatusOverlay/statusStore";

const { show, hide } = useStatusStore.getState();

export const useProductStore = create<IProductState>((set, get) => ({
    products: [],
    pagination: {
      type: "client",
      current_page: 1,
      last_page: 1,
      per_page: 0,
      total: 0,
      has_more: false,
    },
    trashedProducts: [],
    isLoading: false,
    error: null,

    // 🛠️ جلب المنتجات
    fetchAdminProducts: async (filters = {}) => {
        set({ isLoading: true });

        try {
            const data = await productService.getAll(filters);
            const { items, pagination } = data;
            
            set({ 
                products: items,
                pagination: pagination,
                error: null 
            });
        } catch (err: any) {
            set({ error: err.message });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    // 🗑️ جلب المنتجات المحذوفة
    fetchTrashed: async (filters = {}) => {
        set({ isLoading: true });

        try {
            const data = await productService.getTrashed(filters);
            // بناءً على الـ Controller الخاص بك، الاستجابة قد تكون داخل items أو مباشرة
            const items = data?.items || data || [];
            set({ trashedProducts: items });
        } catch (err: any) {
            set({ error: err.message });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    // ➕ إضافة منتج
    addProduct: async (payload) => {
        show("loading", "جاري إنشاء المنتج والمتغيرات...");
        try {
            const response = await productService.create(payload);
            const newProduct = response?.product || response;
            
            set((state) => ({
                products: [newProduct, ...state.products],
            }));

            show("success", "تم إضافة المنتج بنجاح");
            return true;
        } catch (err: any) {
            set({ error: err.message });
            show("error", "فشل إضافة المنتج");
            return false;
        } finally {
            setTimeout(() => hide(), 1500);
        }
    },

    // ✏️ تحديث منتج
    updateProduct: async (id, payload) => {
        show("loading", "جاري حفظ التعديلات...");
        try {
            const response = await productService.update(id, payload);
            const updated = response?.product || response;

            set((state) => ({
                products: state.products.map((p) =>
                    p.id === id ? updated : p
                ),
            }));

            show("success", "تم تحديث المنتج بنجاح");
            return true;
        } catch (err: any) {
            set({ error: err.message });
            show("error", "فشل تحديث المنتج");
            return false;
        } finally {
            setTimeout(() => hide(), 1500);
        }
    },

    // 🗑️ حذف (Soft delete) ونقله للمهملات
    deleteProduct: async (id) => {
        show("loading", "جاري نقل المنتج للمهملات...");
        try {

            const deletedProduct = await productService.remove(id);

            set((state) => ({
                products: state.products.filter((p) => p.id !== id),
                trashedProducts: deletedProduct 
                    ? [deletedProduct, ...state.trashedProducts] 
                    : state.trashedProducts
            }));

            show("success", "تم الحذف بنجاح");
        } catch (err: any) {
            show("error", "فشل الحذف");
            throw err;
        } finally {            // الآن نلتقط المنتج المحذوف الذي أرجعه السيرفر مباشرة
            setTimeout(() => hide(), 1000);
        }
    },

    // ♻️ استعادة المنتج من المهملات
    restoreProduct: async (id) => {
        show("loading", "جاري استعادة المنتج...");

        try {
            await productService.restore(id);

            set((state) => {
                const item = state.trashedProducts.find((p) => p.id === id);

                return {
                    products: item
                        ? [item, ...state.products]
                        : state.products,
                    trashedProducts: state.trashedProducts.filter((p) => p.id !== id),
                };
            });

            show("success", "تم استعادة المنتج");
        } catch (err: any) {
            set({ error: err.message });
            throw err;
        } finally {
            setTimeout(() => hide(), 1000);
        }
    },

    // 🔄 تغيير حالة المنتج (تفعيل / إيقاف)
    updateProductStatus: async (id, status) => {
        show("loading", "جاري التغيير...");
        try {
            const result = await productService.toggleStatus(id);
            const newStatus = result?.product?.status ?? status;

            set((state) => ({
                products: state.products.map((p) =>
                    p.id === id ? { ...p, status: newStatus } : p
                ),
            }));
            show("success", "تم تغيير الحالة");

        } catch (err: any) {
            // التراجع في حال حدوث خطأ
            set((state) => ({
                products: state.products.map((p) =>
                    p.id === id ? { ...p, status: status } : p
                ),
            }));

            set({ error: err.message });
            throw err;
        } finally {
            setTimeout(() => hide(), 1000);
        }
    },
}));