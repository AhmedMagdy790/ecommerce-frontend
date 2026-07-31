import { create } from 'zustand';
import { countryService } from '../services/countryService';
import { useStatusStore } from '@/shared/components/StatusOverlay/statusStore';
import { type CountryFormData } from '../schema/countrySchema';
import type { CountryState } from '../types';

const { show, hide } = useStatusStore.getState();

export const useCountryStore = create<CountryState>((set, get) => ({
  countries: [],
  pagination: null,
  loading: false,
  searchQuery: '',

  fetchCountriesForAdmin: async (params?: Record<string, any>) => {
    set({ loading: true });
    try {
      const response = await countryService.getAllForAdmin(params);

      const responseData = response?.data || response;


      set({
          countries: responseData.items,
          pagination: responseData.pagination,
          loading: false,
      });
    } catch (error) {
      console.error("Fetch Countries Error:", error);
      set({ loading: false });
    }
  },

  setSearchQuery: (query: string) => set({ searchQuery: query }),

  toggleCountryStatus: async (id: number) => {
    show("loading", "جاري تعديل الدولة...", "none");

    try {
      const updatedCountry = await countryService.toggleActive(id);

      const msg = updatedCountry.is_active ? "تم تفعيل الدولة" : "تم تعطيل الدولة";

      show("success", msg, 'none');
      set((state) => ({
        countries: state.countries.map((c) => 
          c.id === id ? { ...c, is_active: updatedCountry.is_active } : c
        ),
      }));
    } catch (error) {
      console.error("Failed to toggle status");
       throw error;
    } finally {
      setTimeout(() => hide(), 1200);
    }
  },

  createCountry: async (data: CountryFormData) => {
    set({ loading: true });

    try {
      show("loading", "جاري حفظ بيانات الدولة...");

      const formattedData = {
        name: {
          ar: data.name_ar,
          en: data.name_en
        },
        code: data.code,
        phone_code: data.phone_code,
        is_active: data.is_active
      };

      const newCountry = await countryService.store(formattedData);

      set((state) => ({
        countries: [newCountry, ...state.countries],
        loading: false
      }));

      show("success", "تم حفظ الدولة بنجاح!");

    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء الحفظ';
      show("error", errorMessage);
      setTimeout(() => hide(), 2000);
       throw error;
    } finally {
      set({ loading: false });
      setTimeout(() => hide(), 1200);
    }
  },

  updateCountry: async (id: string, data: CountryFormData) => {
    set({ loading: true });

    try {
      show("loading", "جاري تحديث بيانات الدولة...");

      const formattedData = {
        name: {
          ar: data.name_ar,
          en: data.name_en
        },
        code: data.code,
        phone_code: data.phone_code,
        is_active: data.is_active
      };

      const updatedCountry = await countryService.update(id, formattedData);

      set((state) => ({
        countries: state.countries.map((c) => (c.id === Number(id) ? updatedCountry : c)),
        loading: false
      }));

      show("success", "تم تحديث الدولة بنجاح!");

    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء الحفظ';
      show("error", errorMessage);
      setTimeout(() => hide(), 2000);
       throw error;
    } finally {
      set({ loading: false });
      setTimeout(() => hide(), 1200);
    }
  },

  deleteCountry: async (id: number) => {
    show("loading", "جاري حذف الدولة...");
    try {
      await countryService.delete(id);
      set((state) => ({
        countries: state.countries.filter((c) => c.id !== id),
      }));

      show("success", "تم حذف الدولة بنجاح!");
      setTimeout(() => hide(), 1200);

    } catch (error) {
      console.error("Failed to delete");
       throw error;
    } finally {
      setTimeout(() => hide(), 1200);
    }
  },

  getFilteredCountries: () => {
    const { countries, searchQuery } = get();
    const query = searchQuery.toLowerCase().trim();

    if (!query) return countries;

    return countries.filter((c) => {
      const matchesCode = c.code.toLowerCase().includes(query);
      const allNames = Object.values(c.name || {}).join(" ").toLowerCase();
      const matchesName = allNames.includes(query);

      return matchesCode || matchesName;
    });
  },
}));