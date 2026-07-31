import { create } from 'zustand';
import { cityService } from '../services/cityService';
import { useStatusStore } from '@/shared/components/StatusOverlay/statusStore';
import type { CityState, ICity } from '../types';

const { show, hide } = useStatusStore.getState();

export const useCityStore = create<CityState>((set, get) => ({
  cities: [],
  shippingOptions: [],
  loading: false,
  searchQuery: '',

  fetchCities: async (country_id: number) => {


    set({ loading: true });
    try {
      const cities = await cityService.getByCountry(country_id);

      set({ 
        cities: Array.isArray(cities) ? cities : [], 
        loading: false 
      });
    } catch (error) {
      console.error("Fetch Cities Error:", error);
      set({ loading: false });
    }
  },

  fetchShippingMethods: async (cityId: number) => {

    set({ loading: true });
    try {
      const options = await cityService.shippingOptions(cityId);
  
      set({ shippingOptions: options });
    } catch (error) {
      console.error("Error fetching shipping options", error);
    } finally {
      set({ loading: false });
    }
  },

  // 2. تحديث نص البحث
  setSearchQuery: (query: string) => set({ searchQuery: query }),

  // 3. تغيير حالة التفعيل (Toggle Status)
  toggleCityStatus: async (id: number) => {
    show("loading", "جاري تحديث حالة المدينة...", "none");

    try {
      const updatedCity = await cityService.toggleActive(id);
      const msg = updatedCity.is_active ? "تم تفعيل المدينة بنجاح" : "تم تعطيل المدينة";

      show("success", msg, 'none');

      // تحديث الحالة محلياً في المتجر
      set((state) => ({
        cities: state.cities.map((c) => 
          c.id === id ? { ...c, is_active: updatedCity.is_active } : c
        ),
      }));
    } catch (error) {
      console.error("Toggle Status Error:", error);
      show("error", "فشل في تغيير الحالة");
      throw error;
    } finally {
      setTimeout(() => hide(), 1200);
    }
  },

  // 4. إضافة مدينة جديدة
  createCity: async (data: ICity) => {
    set({ loading: true });
    show("loading", "جاري حفظ المدينة الجديدة...");

    console.log(data)
    try {
      const newCity = await cityService.store(data);
      
      set((state) => ({
        cities: [newCity, ...state.cities],
        loading: false
      }));

      show("success", "تمت إضافة المدينة بنجاح!");
    } catch (error: any) {
      console.error("Create City Error:", error);
      const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء الإضافة';
      show("error", errorMessage);
      throw error;
    } finally {
      set({ loading: false });
      setTimeout(() => hide(), 1200);
    }
  },

  // 5. تحديث بيانات مدينة موجودة
  updateCity: async (id: number, data: any) => {
    set({ loading: true });
    show("loading", "جاري تحديث البيانات...");

    try {
      const updatedCity = await cityService.update(id, data);
      
      set((state) => ({
        cities: state.cities.map((c) => (c.id === id ? updatedCity : c)),
        loading: false
      }));

      show("success", "تم تحديث بيانات المدينة!");
    } catch (error: any) {
      console.error("Update City Error:", error);
      const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء التحديث';
      show("error", errorMessage);
      throw error;
    } finally {
      set({ loading: false });
      setTimeout(() => hide(), 1200);
    }
  },

  // 6. حذف مدينة
  deleteCity: async (id: number) => {
    show("loading", "جاري حذف المدينة...");
    
    try {
      await cityService.delete(id);
      
      set((state) => ({
        cities: state.cities.filter((c) => c.id !== id),
      }));

      show("success", "تم حذف المدينة بنجاح");
    } catch (error) {
      console.error("Delete City Error:", error);
      show("error", "لا يمكن حذف المدينة لارتباطها ببيانات أخرى");
      throw error;
    } finally {
      setTimeout(() => hide(), 1200);
    }
  },

  addShippingRate: async (cityId: number, data: any) => {
    set({ loading: true });
    show("loading", "جاري حفظ إعدادات الشحن...");

    try {
      // استدعاء الخدمة لإرسال البيانات للمسار المخصص
      const response = await cityService.addShippingRate(cityId, data);
      
      show("success", "تم حفظ أسعار الشحن بنجاح!");
      
      // إذا كنت بحاجة لتحديث بيانات المدينة محلياً بعد إضافة السعر
      await get().fetchCities(); 

      return response;
    } catch (error: any) {
      console.error("Add Shipping Rate Error:", error);
      const errorMessage = error.response?.data?.message || 'فشل في حفظ أسعار الشحن';
      show("error", errorMessage);
      throw error;
    } finally {
      set({ loading: false });
      setTimeout(() => hide(), 1200);
    }
  },

  // 7. منطق الفلترة والبحث
  getFilteredCities: () => {
    const { cities, searchQuery } = get();
    const query = searchQuery.toLowerCase().trim();

    if (!query) return cities;

    return cities.filter((city) => {
      // البحث في كود المدينة
      const matchesCode = city.city_code?.toLowerCase().includes(query);

      // البحث في الأسماء (سواء كانت كائن ترجمة أو نص عادي)
      const nameAr = city.name?.ar?.toLowerCase() || "";
      const nameEn = city.name?.en?.toLowerCase() || "";
      const matchesName = nameAr.includes(query) || nameEn.includes(query);

      // البحث في اسم الدولة المرتبطة (اختياري)
      const countryName = city.country?.name?.ar?.toLowerCase() || city.country?.name?.en?.toLowerCase() || "";
      const matchesCountry = countryName.includes(query);

      return matchesCode || matchesName || matchesCountry;
    });
  },
}));