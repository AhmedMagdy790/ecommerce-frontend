import { create } from "zustand";
import paymentGatewayService from "../services/paymentGatewayService";
import { type IPaymentGatewayState } from "../types/types";
import { useStatusStore } from "@/shared/components/StatusOverlay/statusStore";

const { show, hide } = useStatusStore.getState();

export const usePaymentGatewayStore = create<IPaymentGatewayState>((set, get) => ({
    gateways: [],
    isLoading: false,
    error: null,
    pagination: {
        type: "server",
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 50,
        has_more: false,
    },

    // 🌐 جلب البوابات النشطة للعملاء
    fetchActiveGateways: async () => {
        set({ isLoading: true });
        try {
            // تأكد من اسم الدالة في الـ Service (غالباً getActive أو getActiveMethods)
            const data = await paymentGatewayService.getActive ? await paymentGatewayService.getActive() : [];
            set({ gateways: data, error: null });
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ isLoading: false });
        }
    },

    // 🛠️ جلب كل البوابات للأدمن (مع الـ Pagination والـ Filters)
    fetchAdminGateways: async (filters = {}) => {
        set({ isLoading: true });
        try {
            const response = await paymentGatewayService.getAllAdmin(filters);
            
            // بناءً على هيكل الباك إند: { items, pagination }
            set({ 
                gateways: response.items || response, 
                pagination: response.pagination || get().pagination,
                error: null 
            });
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ isLoading: false });
        }
    },

    getById: async (id: number| string) => {

        set({ isLoading: true });
        try {
            // تأكد أن الـ service يحتوي على دالة لجلب العنصر الواحد مثل paymentGatewayService.getById(id)
            const response = await paymentGatewayService.getById(id);

            console.log(response)
            return response.data || response;
        } catch (err: any) {
            set({ error: err.message });
            return null;
        } finally {
            set({ isLoading: false });
        }
    },

    // ➕ إضافة بوابة جديدة
    addGateway: async (payload) => {

        show("loading", "جاري إضافة بوابة الدفع...");
        try {
            const newGateway = await paymentGatewayService.create(payload);
            set((state) => ({
                gateways: [...state.gateways, newGateway],
            }));
            show("success", "تمت الإضافة بنجاح");
            return true;
        } catch (err: any) {
            show("error", "فشل إضافة البوابة");
            throw err;
        } finally {
            setTimeout(() => hide(), 1500);
        }
    },

    // ✏️ تحديث بيانات البوابة
    updateGateway: async (id, payload) => {
        show("loading", "جاري حفظ التغييرات...");
        try {
            const updated = await paymentGatewayService.update(id, payload);
            set((state) => ({
                gateways: state.gateways.map((g) => (g.id === id ? updated : g)),
            }));
            show("success", "تم التحديث بنجاح");
            return true;
        } catch (err: any) {
            show("error", "فشل التحديث");
            throw err;
        } finally {
            setTimeout(() => hide(), 1500);
        }
    },

    // 🔘 تفعيل أو تعطيل البوابة
    toggleGatewayStatus: async (id) => {
        show("loading", "جاري تغيير الحالة...");
        try {
            const result = await paymentGatewayService.toggleStatus(id);
            set((state) => ({
                gateways: state.gateways.map((g) =>
                    g.id === id ? { ...g, is_active: result.is_active } : g
                ),
            }));
            show("success", "تم تغيير حالة التفعيل");
        } catch (err: any) {
            show("error", "حدث خطأ أثناء تغيير الحالة");
            throw err;
        } finally {
            setTimeout(() => hide(), 1000);
        }
    },

    // 🧪 تبديل وضع الاختبار
    toggleGatewayTestMode: async (id) => {
        show("loading", "جاري التبديل...");
        try {
            const result = await paymentGatewayService.toggleTestMode(id);
            set((state) => ({
                gateways: state.gateways.map((g) =>
                    g.id === id ? { ...g, is_test_mode: result.is_test_mode } : g
                ),
            }));
            show("success", "تم تبديل وضع التشغيل");
        } catch (err: any) {
            show("error", "فشل التبديل");
            throw err;
        } finally {
            setTimeout(() => hide(), 1000);
        }
    },

    // 🗑️ حذف نهائي
    deleteGateway: async (id) => {
        show("loading", "جاري الحذف...");
        try {
            await paymentGatewayService.remove(id);
            set((state) => ({
                gateways: state.gateways.filter((g) => g.id !== id),
            }));
            show("success", "تم الحذف بنجاح");
        } catch (err: any) {
            show("error", "لا يمكن حذف البوابة حالياً");
            throw err;
        } finally {
            setTimeout(() => hide(), 1000);
        }
    },
}));