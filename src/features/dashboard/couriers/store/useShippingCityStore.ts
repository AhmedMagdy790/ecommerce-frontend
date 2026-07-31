import { create } from "zustand";
import shippingCityService from "../services/shippingCityService";
import { type IShippingCity } from "../types/types";
import { useStatusStore } from "@/shared/components/StatusOverlay/statusStore";

interface IShippingCityState {
  shippingCities: IShippingCity[];
  isLoading: boolean;
  error: string | null;
  paginationType: "server";
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  } | null;
  fetchShippingCities: (params?: any) => Promise<void>;
  fetchCityDetails: (id: number) => Promise<void>;
  assignCity: (payload: any) => Promise<boolean>;
  updateCity: (id: number, payload: any) => Promise<boolean>;
  toggleCityStatus: (id: number) => Promise<void>;
  removeCity: (cityId: number, courierId: number) => Promise<boolean>; // 👈 تحديث المعاملات لتناسب السيرفر
}

export const useShippingCityStore = create<IShippingCityState>((set, get) => ({
  shippingCities: [],
  isLoading: false,
  error: null,
  paginationType: "server",
  meta: null,

  // ==========================================
  // Fetch All Shipping Cities
  // ==========================================
  fetchShippingCities: async (params) => {
    set({ isLoading: true });
    try {
      const response = await shippingCityService.getAll(params);


      // تأمين جلب المصفوفة بشكل صافي لـ Zustand
      const rawData = response.data !== undefined ? response.data : response;
      const cleanData = Array.isArray(rawData) ? rawData : [];

      set({
        shippingCities: cleanData,
        meta: response.meta || {
          current_page: response.current_page || 1,
          last_page: response.last_page || 1,
          per_page: response.per_page || 10,
          total: response.total || cleanData.length,
        },
        error: null,
      });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch data" });
    } finally {
      set({ isLoading: false });
    }
  },

  // ==========================================
  // Fetch City Details
  // ==========================================
  fetchCityDetails: async (id) => {
    set({ isLoading: true });
    try {
      const data = await shippingCityService.getById(id);
      
      set((state) => ({
        shippingCities: state.shippingCities.some((c) => c.id === id) 
          ? state.shippingCities.map((c) => (c.id === id ? data : c))
          : [data, ...state.shippingCities],
        error: null,
      }));
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // ==========================================
  // Assign City (الربط والـ Upsert)
  // ==========================================
  assignCity: async (payload) => {
    const { show, hide } = useStatusStore.getState();
    show("loading", "جاري تعيين المدينة...");
    
    try {
      const newCity = await shippingCityService.assign(payload);
      
      // إعادة استدعاء الدالة لتحديث الجدول وفقاً للـ Pagination لتجنب اختلال الترتيب
      await get().fetchShippingCities({ page: get().meta?.current_page || 1 });
      
      show("success", "تم تعيين المدينة بنجاح");
      return true;
    } catch (err: any) {
      show("error", "فشل في تعيين المدينة");
      set({ error: err.message });
      return false;
    } finally {
      setTimeout(() => hide(), 1000);
    }
  },

  // ==========================================
  // Update City
  // ==========================================
  updateCity: async (id, payload) => {
    const { show, hide } = useStatusStore.getState();
    show("loading", "جاري تحديث البيانات...");
    
    try {
      const updated = await shippingCityService.update(id, payload);
      
      // تحديث فوري للصف المعدل في الواجهة
      set((state) => ({
        shippingCities: state.shippingCities.map((c) => (c.id === id ? { ...c, ...updated } : c)),
      }));
      
      show("success", "تم التحديث بنجاح");
      return true;
    } catch (err: any) {
      show("error", "فشل التحديث");
      set({ error: err.message });
      return false;
    } finally {
      setTimeout(() => hide(), 1000);
    }
  },

  // ==========================================
  // Toggle Status
  // ==========================================
  toggleCityStatus: async (id) => {
    const { show } = useStatusStore.getState();
    const current = get().shippingCities.find((c) => c.id === id);
    if (!current) return;

    const newStatus = !current.is_active;

    // تحديث متفائل (Optimistic Update) للـ UI الفوري
    set((state) => ({
      shippingCities: state.shippingCities.map((c) =>
        c.id === id ? { ...c, is_active: newStatus } : c
      ),
    }));

    try {
      // إرسال التحديث للسيرفر (إما عبر مسار الـ toggle المباشر أو الـ update)
      await shippingCityService.update(id, { ...current, is_active: newStatus });
      show("success", "تم تغيير الحالة");
    } catch (err: any) {
      // تراجع فوري (Rollback) في حال فشل الـ Request
      set((state) => ({
        shippingCities: state.shippingCities.map((c) =>
          c.id === id ? { ...c, is_active: !newStatus } : c
        ),
      }));
      show("error", "فشل تغيير الحالة");
    }
  },

  // ==========================================
  // Remove City (الحذف المركب المتوافق مع الـ Backend)
  // ==========================================
  removeCity: async (cityId, courierId) => {
    const { show, hide } = useStatusStore.getState();
    show("loading", "جاري الحذف...");
    
    try {
      // استدعاء دالة الحذف المركب من الـ Service الجديد
      await shippingCityService.removeRelation(cityId, courierId);
      
      // فلترة العنصر المحذوف من المصفوفة بداخل الستيت
      set((state) => ({
        shippingCities: state.shippingCities.filter(
          (c) => !(c.city_id === cityId && c.shipping_courier_id === courierId)
        ),
      }));
      
      show("success", "تم الحذف بنجاح");
      return true;
    } catch (err: any) {
      show("error", "فشل في الحذف");
      return false;
    } finally {
      setTimeout(() => hide(), 1000);
    }
  },
}));