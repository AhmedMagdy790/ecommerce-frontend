import { create } from "zustand";
import { useStatusStore } from "@/shared/components/StatusOverlay/statusStore";
import shippingRateService from "../services/shippingRateService";
import { type IShippingRateState } from "../types/types"; // تأكد من استيراد IPagination
import type { IPagination } from "@/shared/types/pagination";

const { show, hide } = useStatusStore.getState();



export const useShippingRateStore =
  create<IShippingRateState>((set, get) => ({
  rates: [],
  allRatesForClient: [], 
  pagination: { 
    type: 'client', 
    current_page: 1, 
    last_page: 1, 
    total: 0 
  },
  isLoading: false,
  error: null,

  // ======================
  // FETCH ALL
  // ======================
  fetchRatesAll: async (filters = {}) => {
    set({ isLoading: true });
    try {
      const response = await shippingRateService.getAll(filters);
      

      // استخراج الـ list و الـ pagination مباشرة من الـ data
      const resData = response.data || response;
      const list = resData?.list || [];
      const paginationData: IPagination = resData?.pagination;

      set({ 
        rates: list, 
        allRatesForClient: paginationData?.type === 'client' ? list : [],
        pagination: {
          type: paginationData?.type || 'server',
          current_page: paginationData?.current_page || 1,
          last_page: paginationData?.last_page || 1,
          total: paginationData?.total || 0
        },
        error: null 
      });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // ======================
  // SMART FILTER
  // ======================
  handleFilter: async (filters: any) => {
    const { pagination } = get();
    if (pagination.type === 'client' && !filters.search) {
       return;
    } 
    await get().fetchRatesAll(filters);
  },

  // ======================
  // TOGGLE STATUS
  // ======================
  toggleShippingRateStatus: async (id: number) => {
    show("loading", "جاري التعديل ...");
    const previousRates = get().rates;

    try {
      const updatedRate = await shippingRateService.toggleStatus(id);

      console.log("updatedRate", updatedRate);
      
      // التأكد من قراءة الحالة الجديدة سواء كانت داخل settings أو على المستوى الرئيسي
      const newIsActive = updatedRate?.settings?.is_active;

      set((state) => ({
        rates: state.rates.map((r) =>
          r.id === id 
            ? { 
                ...r, 
                settings: { 
                  ...r.settings, 
                  is_active: newIsActive 
                } 
              } 
            : r
        ),
      }));

      show("success", newIsActive ? "تم التفعيل" : "تم التعطيل");
    } catch (err: any) {
      set({ rates: previousRates });
      show("error", "حدث خطأ أثناء التحديث");
    } finally {
      setTimeout(() => hide(), 1000);
    }
  },

  // ======================
  // CREATE RATE (STORE)
  // ======================
  createRate: async (cityId, payload) => {
    show("loading", "جاري إضافة سعر الشحن للمدينة...");
    try {
      const newRate = await shippingRateService.create(cityId, payload);

      set((state) => ({
        rates: [newRate, ...state.rates],
      }));

      show("success", "تمت الإضافة بنجاح");
      return true;
    } catch (err: any) {
      set({ error: err.message });
      show("error", err.response?.data?.message || "فشل في الإضافة");
      throw err;
    } finally {
      setTimeout(() => hide(), 1000);
    }
  },

  // ======================
  // SET RATE (UPDATE)
  // ======================
  setRate: async (cityId, rateId, payload) => {
    show("loading", "جاري تحديث إعدادات الشحن...");
    try {
      const updatedItem = await shippingRateService.setRate(cityId, rateId, payload);

      set((state) => ({
        rates: state.rates.map((r) => {
          if (r.id === rateId) {
            return { 
              ...r,
              ...payload,
              ...updatedItem
            };
          }
          return r;
        }),
      }));

      show("success", "تم تحديث البيانات بنجاح");
      return true;
    } catch (err: any) {
      console.error("Update Error:", err);
      show("error", err.response?.data?.message || "فشل التحديث");
      throw err;
    } finally {
      setTimeout(() => hide(), 1000);
    }
  },

  // ======================
  // DELETE RATE
  // ======================
  deleteRate: async (rateId) => {
    show("loading", "جاري الحذف...");
    try {
      await shippingRateService.remove(rateId); 

      set((state) => ({
        rates: state.rates.filter((r) => r.id !== rateId),
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