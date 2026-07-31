import { create } from 'zustand';
import categoryService from '../services/categoryService';
import { toast } from 'react-hot-toast';
import { type ICategoryState } from '../types/types';
import { useStatusStore } from '@/shared/components/StatusOverlay/statusStore';


const { show, hide } = useStatusStore.getState();

export const useCategoryStore = create<ICategoryState>((set, get) => ({
  categories: [],
  adminCategories: [],
  trashedCategories: [],
  stats: {
    all: 0,
    total: 0,
    active: 0,
    inactive: 0,
    trashed: 0
  },
  isLoading: false,
  error: null,


  fetchPublicCategories: async () => {

    set({ isLoading: true });
    try {
      const data = await categoryService.getPublicCategories();
      set({ categories: data, error: null });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },


  fetchAdminCategories: async () => {

    set({ isLoading: true });
    try {
      const data = await categoryService.getAllAdmin();

      set({ 
        adminCategories: data?.items, 
        stats: data?.stats,
        error: null 
      });
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
      const data = await categoryService.getTrashed();

      set({ trashedCategories: data });
    } catch (err) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // ➕ إضافة قسم جديد
  addCategory: async (payload) => {
    set({ isLoading: true });
    show("loading", "جاري إضافة القسم...");


    try {
      const newCategory = await categoryService.create(payload);
      set((state) => ({
        adminCategories: [newCategory, ...state.adminCategories],
      }));
      return true;
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // ✏️ تحديث قسم
  updateCategory: async (id, payload) => {
    show("loading", "جاري تحديث القسم...");


    try {
      const updated = await categoryService.update(id, payload);
      set((state) => ({
        adminCategories: state.adminCategories.map((cat) =>
          cat.id === id ? updated : cat
        ),
      }));
      return true;
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    } finally {

      setTimeout(() => hide(), 1000)
    }
  },


  // 🗑️ حذف قسم (Restory)
  restoreCategory: async (id) => {
    show("loading", "جاري استعادة القسم...");
    try {
      await categoryService.restore(id);
      set((state) => {
        const restoredItem = state.trashedCategories.find((cat) => cat.id === id);

        return {
          adminCategories: restoredItem
            ? [...state.adminCategories, restoredItem]
            : state.adminCategories,

          trashedCategories: state.trashedCategories.filter((cat) => cat.id !== id),
        };

      });

    } catch (err: any) {
      set({ error: err.message });
      throw err;
    } finally {

      show("success", "تم استعادة القسم...");
      setTimeout(() => hide(), 1000)
    }
  },

  // 🗑️ حذف قسم (Soft Delete)
  deleteCategory: async (id) => {
    show("loading", "جاري حذف القسم...");
    try {
      await categoryService.remove(id);
      set((state) => ({
        adminCategories: state.adminCategories.filter((cat) => cat.id !== id),
        // Optional: Add to trashedCategories if your API supports it
      }));
      show("success", "تم حذف القسم بنجاح!");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "حدث خطأ أثناء الحذف";
      show("error", msg, "blur", true);
      throw err;
    } finally {
      setTimeout(() => hide(), 1500); // Ensure hide happens
    }
  },

  // ⚡ تغيير الحالة (Active/Inactive)
  toggleCategoryStatus: async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    try {
      // تحديث محلي سريع (Optimistic Update)
      set((state) => ({
        adminCategories: state.adminCategories.map((cat) =>
          cat.id === id ? { ...cat, status: newStatus } : cat
        ),
      }));

      const result = await categoryService.toggleStatus(id, newStatus);

      const msg = result.status == "active" ? 'تم تفعيل الفئة' : "تم تعطيل الفئة";
      show("success", msg);
    } catch (err: any) {
      // تراجع عن التغيير في حال فشل السيرفر

      set((state) => ({
        adminCategories: state.adminCategories.map((cat) =>
          cat.id === id ? { ...cat, status: currentStatus } : cat
        ),
      }));

      set({ error: err.message });
      throw err;

    } finally {

      setTimeout(() => hide(), 1000)
    }
  },
}));