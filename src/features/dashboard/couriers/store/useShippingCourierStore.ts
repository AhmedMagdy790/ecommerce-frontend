import { create } from "zustand";

import shippingCourierService from "../services/shippingCourierService";

import {
  type IShippingCourierPayload,
  type IShippingCourierState
} from "../types/types";

import { useStatusStore } from "@/shared/components/StatusOverlay/statusStore";

const { show, hide } = useStatusStore.getState();

export const useShippingCourierStore =
  create<IShippingCourierState>((set, get) => ({
    items: [],
    pagination: {
      type: "client",
      current_page: 1,
      last_page: 1,
      per_page: 0,
      total: 0,
      has_more: false,
    },
    trashedItems: [],
    isLoading: false,
    toggleIsLoading: false,
    stats: {
      total: 0,
      active: 0,
      trashed: 0,
    },
    error: null,



    // =================================
    // Fetch All
    // =================================
    fetchShippingCouriers: async () => {
      set({ isLoading: true });

      try {
        const response = await shippingCourierService.getAll();

        const items = response?.data || [];
        const pagination = response?.pagination;
        const stats = response?.stats;

        set({
          items,
          pagination: pagination || get().pagination, 
          stats: stats || get().stats, 
          error: null,
        });

      } catch (err: any) {
        set({
          error: err.message,
        });

        throw err;
      } finally {
        set({ isLoading: false });
      }
    },

    // =================================
    // Fetch Trashed
    // =================================
    fetchTrashedShippingCouriers: async () => {
      set({ isLoading: true });

      try {
        const response = await shippingCourierService.getTrashed();

        const items = response?.data || [];
        const pagination = response?.pagination;
        const stats = response?.stats;

        set({
          trashedItems: items,
          pagination: pagination || get().pagination, 
          stats: stats || get().stats, 
          error: null,
        });

      } catch (err: any) {
        set({
          error: err.message,
        });

        throw err;
      } finally {
        set({ isLoading: false });
      }
    },

    // =================================
    // Create
    // =================================
    addShippingCourier: async (
      payload: IShippingCourierPayload
    ) => {
      set({ isLoading: true });

      show("loading", "جاري إضافة شركة الشحن...");

      try {
        const response =
          await shippingCourierService.create(
            payload
          );

        // التعامل مع حالات الاستجابة المختلفة (سواء كانت داخل data أو الـ object مباشرة)
        const newCourier = response?.data || response;

        set((state) => ({
          items: [
            newCourier,
            ...state.items,
          ],
          stats: {
            ...state.stats,
            total: (state.stats.total ?? 0) + 1,
            active: (state.stats.active ?? 0) + 1,
          }
        }));

        show("success", "تم إضافة شركة الشحن");

        return true;
      } catch (err: any) {
        set({
          error: err.message,
        });

        throw err;
      } finally {
        set({ isLoading: false });

        setTimeout(() => hide(), 1000);
      }
    },

    // =================================
    // Update
    // =================================
// تعديل طريقة إرسال بيانات الـ name في ملف الـ Store أو في دالة الإرسال قبل تمريرها للـ API 
// لضمان إرسال الكائن بالشكل الذي يتوقعه Laravel (مثل JSON أو مصفوفة مفتاح-قيمة مناسبة للـ validation rules)

    addShippingCourier: async (payload: IShippingCourierPayload) => {
      set({ isLoading: true });

      show("loading", "جاري إضافة شركة الشحن...");

      try {
        // تأكيد إرسال الحقول كبنية بيانات متوافقة مع قواعد التحقق في السيرفر
        const formattedPayload = {
          ...payload,
          name: {
            ar: payload.name?.ar || "",
            en: payload.name?.en || null,
          },
        };

        const response = await shippingCourierService.create(formattedPayload);

        const newCourier = response?.data || response;

        set((state) => ({
          items: [newCourier, ...state.items],
          stats: {
            ...state.stats,
            total: (state.stats.total ?? 0) + 1,
            active: (state.stats.active ?? 0) + 1,
          },
        }));

        show("success", "تم إضافة شركة الشحن");
        return true;
      } catch (err: any) {
        set({ error: err.message });
        throw err;
      } finally {
        set({ isLoading: false });
        setTimeout(() => hide(), 1000);
      }
    },

    updateShippingCourier: async (id: number, payload: Partial<IShippingCourierPayload>) => {
      set({ isLoading: true });
      show("loading", "جاري تحديث شركة الشحن...");

      try {
        const formattedPayload = {
          ...payload,
          ...(payload.name && {
            name: {
              ar: payload.name?.ar || "",
              en: payload.name?.en || null,
            },
          }),
        };

        const response = await shippingCourierService.update(id, formattedPayload);

        const updatedCourier = response?.data || response;

        set((state) => ({
          items: state.items.map((courier) => (courier.id === id ? updatedCourier : courier)),
        }));

        show("success", "تم تحديث شركة الشحن");
        return true;
      } catch (err: any) {
        set({ error: err.message });
        throw err;
      } finally {
        set({ isLoading: false });
        setTimeout(() => hide(), 1000);
      }
    },

    // =================================
    // Toggle Status
    // =================================
    toggleShippingCourierStatus: async (id: number) => {
      set({toggleIsLoading: true});
      const courier = get().items.find((c) => c.id === id);
      if (!courier) return;
      const oldStatus = courier.is_active;

      // تحديث متفائل (Optimistic Update) محلياً
      set((state) => ({
        items: state.items.map((c) =>
          c.id === id ? { ...c, is_active: !oldStatus } : c
        ),
      }));

      try {
        const response = await shippingCourierService.toggleStatus(id);
        
        // استخراج كائن شركة الشحن المحدث من الـ response بشكل صحيح
        const updatedCourier = response?.data || response;

        set((state) => ({
          items: state.items.map((c) => (c.id === id ? updatedCourier : c)),
        }));

        show("success", "تم تغيير حالة شركة الشحن بنجاح");
      } catch (err: any) {
        // التراجع في حال الفشل
        set((state) => ({
          items: state.items.map((c) =>
            c.id === id ? { ...c, is_active: oldStatus } : c
          ),
        }));
        show("error", "فشل تغيير حالة شركة الشحن");
        throw err;
      } finally {
        setTimeout(() => set({toggleIsLoading: false}), 1000);
        setTimeout(() => hide(), 1000);
      }
    },

    // =================================
    // Soft Delete
    // =================================
    deleteShippingCourier: async (
      id: number
    ) => {
      show("loading", "جاري حذف شركة الشحن...");

      try {
        await shippingCourierService.remove(id);

        set((state) => ({
          items:
            state.items.filter(
              (courier) =>
                courier.id !== id
            ),
          stats: {
            ...state.stats,
            active: (state.stats.active ?? 0) - 1,
            trashed: (state.stats.trashed ?? 0) + 1
          }
        }));


        show(
          "success",
          "تم نقل شركة الشحن إلى المهملات"
        );
      } catch (err: any) {
        set({
          error: err.message,
        });

        throw err;
      } finally {
        setTimeout(() => hide(), 1000);
      }
    },

    // =================================
    // Restore
    // =================================
    restoreShippingCourier: async (
      id: number
    ) => {
      show("loading", "جاري استعادة شركة الشحن...");

      try {
        const response =
          await shippingCourierService.restore(
            id
          );

        const restoredCourier = response?.data || response;

        set((state) => ({
          items: [
            restoredCourier,
            ...state.items,
          ],

          stats: {
            ...state.stats,
            trashed: (state.stats.trashed ?? 0) - 1,
            active: (state.stats.active ?? 0) + 1
          },

          trashedItems:
            state.trashedItems.filter(
              (courier) =>
                courier.id !== id
            ),
        }));

        show(
          "success",
          "تم استعادة شركة الشحن"
        );
      } catch (err: any) {
        set({
          error: err.message,
        });

        throw err;
      } finally {
        setTimeout(() => hide(), 1000);
      }
    },

    // =================================
    // Force Delete
    // =================================
    forceDeleteShippingCourier: async (
      id: number
    ) => {
      show("loading", "جاري حذف شركة الشحن نهائيًا...");

      try {
        await shippingCourierService.forceDelete(
          id
        );

        set((state) => ({
          trashedItems:
            state.trashedItems.filter(
              (courier) =>
                courier.id !== id
            ),
          stats: {
            ...state.stats,
            total: (state.stats.total ?? 0) - 1,
            trashed: (state.stats.trashed ?? 0) - 1,
          }
        }));

        show(
          "success",
          "تم حذف شركة الشحن نهائيًا"
        );
      } catch (err: any) {
        set({
          error: err.message,
        });

        throw err;
      } finally {
        setTimeout(() => hide(), 1000);
      }
    },
  }));