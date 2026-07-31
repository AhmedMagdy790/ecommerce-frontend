import { create } from "zustand";
import productVariantService from "../services/productVariantService";
import { useStatusStore } from "@/shared/components/StatusOverlay/statusStore";
import { type IProductVariantState } from "../types/types";

const { show, hide } = useStatusStore.getState();


export const useProductVariantStore = create<IProductVariantState>((set, get) => ({
    variants: [],
    isLoading: false,
    meta: {
        current_page: 1,
        last_page: null,
        total: null
    },
    paginationType: 'client',
    error: null,


    // =========================
    // Fetch variants by product
    // =========================

    fetchAdminVariants: async (filters = {}) => {
        set({ isLoading: true });
      
        try {
            const data = await productVariantService.getAllVariantsAdmin(filters);

            const { list, meta } = data;


            set({ 
                variants: list,
                paginationType: meta.pagination_type,
                meta: {
                    current_page: meta.current_page || 1,
                    last_page: meta.last_page || 1,
                    total: meta.total
                },
                error: null 
            });
        } catch (err: any) {
            set({ error: err.message });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    // =========================
    // Fetch variants by product
    // =========================
    fetchByProduct: async (productId) => {
        set({ isLoading: true });

        try {
            const data = await productVariantService.getByProduct(productId);

            set({
                variants: data,
                error: null,
            });
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ isLoading: false });
        }
    },

    // =========================
    // Add variant
    // =========================
    addVariant: async (productId, payload) => {
        show("loading", "جاري إضافة المتغير...");

        try {
            const newVariant = await productVariantService.create(productId, payload);

            set((state) => ({
                variants: [newVariant, ...state.variants],
            }));

            show("success", "تم إضافة المتغير بنجاح");
        } catch (err: any) {
            set({ error: err.message });
            throw err;
        } finally {
            setTimeout(() => hide(), 1000);
        }
    },

    // =========================
    // Update variant
    // =========================
    updateVariant: async (id, payload) => {

        show("loading", "جاري تحديث المتغير...");


        try {
            const updated = await productVariantService.update(id, payload);

            set((state) => ({
                variants: state.variants.map((v) =>
                    v.id === id ? updated : v
                ),
            }));

            show("success", "تم التحديث بنجاح");
        } catch (err: any) {
            set({ error: err.message });
            throw err;
        } finally {
            setTimeout(() => hide(), 1000);
        }
    },

    updateVariantStatus: async (id, currentStatus) => {
        let newStatus: "active" | "archived" | "draft" = "active";

        if (currentStatus === "active") newStatus = "archived";
        else if (currentStatus === "archived") newStatus = "draft";
        else newStatus = "active";

        try {
            // optimistic update
            set((state) => ({
                variants: state.variants.map((p) =>
                    p.id === id ? { ...p, status: newStatus } : p
                )
            }));

            const result = await productVariantService.updateStatus(id, newStatus);

            show("success", `تم تغيير الحالة إلى ${result.status}`);
        } catch (err: any) {
            // rollback
            set((state) => ({
                variants: state.variants.map((p) =>
                    p.id === id ? { ...p, status: currentStatus } : p
                ),
            }));

            set({ error: err.message });
            throw err;
        } finally {
            setTimeout(() => hide(), 1000);
        }
    },

    // /products/{variant}/toggl

    // =========================
    // Update stock only
    // =========================
    updateStock: async (id, stock) => {
        show("success", "جاري التعديل");

        try {
            // optimistic update
            set((state) => ({
                variants: state.variants.map((v) =>
                    v.id === id ? { ...v, stock } : v
                ),
            }));

            await productVariantService.updateStock(id, stock);

            show("success", "تم تحديث المخزون");
        } catch (err: any) {
            set({ error: err.message });
            throw err;
        }  finally {
            setTimeout(() => hide(), 300);
        }
    },

    // =========================
    // Delete variant (soft)
    // =========================
    deleteVariant: async (id) => {
   
        try {
            await productVariantService.remove(id);

            set((state) => ({
                variants: state.variants.filter((v) => v.id !== id),
            }));

            show("success", "تم حذف المتغير");
        } catch (err: any) {
            set({ error: err.message });
            throw err;
        } finally {
            setTimeout(() => hide(), 1000);
        }
    },

    // =========================
    // Restore variant
    // =========================
    restoreVariant: async (id) => {
        show("loading", "جاري الاستعادة...");

        try {
            const restored = await productVariantService.restore(id);

            set((state) => ({
                variants: [restored, ...state.variants],
            }));

            show("success", "تم استعادة المتغير");
        } catch (err: any) {
            set({ error: err.message });
            throw err;
        } finally {
            setTimeout(() => hide(), 1000);
        }
    },
}));

