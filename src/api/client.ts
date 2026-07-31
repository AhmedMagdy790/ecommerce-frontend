import axiosInstance from "@/api/axios-instance"; 
import { API_ENDPOINTS } from "@/api/endpoints";
import { handleApiError } from "@/api/error";

/**
 * دالة تغليف (Wrapper) لتوحيد منطق الطلبات ومعالجة الأخطاء.
 * نقوم بإرجاع بيانات الاستجابة (response.data) مباشرة لتسهيل الاستخدام في الـ Hooks.
 */
const request = async <T>(fn: () => Promise<{ data: T }>): Promise<T> => {
  try {
    const response = await fn();
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// 1. واجهة المستخدم (Storefront API)
export const storeApi = {
  getProducts: <T = any>() => request<T>(() => axiosInstance.get(API_ENDPOINTS.products.list)),
  getProductById: <T = any>(id: string | number) => request<T>(() => axiosInstance.get(API_ENDPOINTS.products.details(id))),
  
  getCategories: <T = any>() => request<T>(() => axiosInstance.get(API_ENDPOINTS.categories.list)),
  getCategoryById: <T = any>(id: string | number) => request<T>(() => axiosInstance.get(API_ENDPOINTS.categories.details(id))),
  
  getCart: <T = any>() => request<T>(() => axiosInstance.get(API_ENDPOINTS.cart.list)),
  addToCart: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.cart.add, data)),
  removeFromCart: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.cart.destroy(id))),
  
  getCheckout: <T = any>() => request<T>(() => axiosInstance.get(API_ENDPOINTS.checkout.index)),
  submitCheckout: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.checkout.store, data)),
  applyCoupon: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.checkout.applyCoupon, data)),
  removeCoupon: <T = any>() => request<T>(() => axiosInstance.delete(API_ENDPOINTS.checkout.removeCoupon)),
  setCheckoutShipping: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.checkout.shipping, data)),

  optionsShipping: <T = any, D = Record<string, any>>(data: D) =>
    request<T>(() =>
      axiosInstance.post(
        API_ENDPOINTS.shipping.options,
        data
      )
    ),


  calculateShipping: <T = any, D = Record<string, any>>(data: D) =>
    request<T>(() =>
      axiosInstance.post(
        API_ENDPOINTS.shipping.calculate,
        data
      )
    ),


  getAddresses: <T = any>() => request<T>(() => axiosInstance.get(API_ENDPOINTS.addresses.list)),
  createAddress: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.addresses.store, data)),
  getAddressById: <T = any>(id: string | number) => request<T>(() => axiosInstance.get(API_ENDPOINTS.addresses.details(id))),
  updateAddress: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.put(API_ENDPOINTS.addresses.update(id), data)),
  deleteAddress: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.addresses.destroy(id))),
  setDefaultAddress: <T = any>(id: string | number) => request<T>(() => axiosInstance.post(API_ENDPOINTS.addresses.setDefault(id))),

  getPageBySlug: <T = any>(slug: string) => request<T>(() => axiosInstance.get(API_ENDPOINTS.pages.bySlug(slug))),
  getSectionById: <T = any>(id: string | number) => request<T>(() => axiosInstance.get(API_ENDPOINTS.sections.bySlug(id))),
  
  getCountries: <T = any>() => request<T>(() => axiosInstance.get(API_ENDPOINTS.geo.countries)),
  getCities: <T = any>(countryId: string | number) => request<T>(() => axiosInstance.get(API_ENDPOINTS.geo.cities(countryId))),
  getCityShippingOptions: <T = any>(cityId: string | number) => request<T>(() => axiosInstance.get(API_ENDPOINTS.geo.shippingCouriers(cityId))),
  checkoutShipping: <T = any, D = Record<string, any>>(data: D) =>
  request<T>(() =>
    axiosInstance.post(API_ENDPOINTS.checkoutShipping, data)
  ),
  getPaymentGateways: <T = any>() => request<T>(() => axiosInstance.get(API_ENDPOINTS.paymentGateways)),
};

// 2. واجهة الإدارة (Admin API)
export const adminApi = {
  // Categories
  getCategories: <T = any>() => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.categories.list)),
  createCategory: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.categories.store, data)),
  getTrashedCategories: <T = any>() => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.categories.trashed)),
  getCategoryById: <T = any>(id: string | number) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.categories.details(id))),
  updateCategory: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.put(API_ENDPOINTS.admin.categories.update(id), data)),
  patchCategory: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.categories.patch(id), data)),
  deleteCategory: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.categories.destroy(id))),
  forceDeleteCategory: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.categories.forceDelete(id))),
  restoreCategory: <T = any>(id: string | number) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.categories.restore(id))),
  toggleCategoryStatus: <T = any>(id: string | number) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.categories.status(id))),

  // Products
  getProducts: <T = any>() => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.products.list)),
  createProduct: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.products.store, data)),
  getTrashedProducts: <T = any>() => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.products.trashed)),
  updateProduct: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.put(API_ENDPOINTS.admin.products.update(id), data)),
  deleteProduct: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.products.destroy(id))),
  forceDeleteProduct: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.products.forceDelete(id))),
  restoreProduct: <T = any>(id: string | number) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.products.restore(id))),
  toggleProductStatus: <T = any>(id: string | number) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.products.toggleStatus(id))),

  // Variants
  createVariant: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.variants.store, data)),
  getTrashedVariants: <T = any>() => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.variants.trashed)),
  getVariantById: <T = any>(id: string | number) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.variants.details(id))),
  updateVariant: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.put(API_ENDPOINTS.admin.variants.update(id), data)),
  forceDeleteVariant: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.variants.forceDelete(id))),
  restoreVariant: <T = any>(id: string | number) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.variants.restore(id))),
  updateVariantStock: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.variants.stock(id), data)),
  toggleVariantStatus: <T = any>(id: string | number) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.variants.toggleStatus(id))),

  // Orders
  getOrders: <T = any>() => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.orders.list)),
  getTrashedOrders: <T = any>() => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.orders.trashed)),
  getOrderById: <T = any>(id: string | number) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.orders.details(id))),
  updateOrder: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.put(API_ENDPOINTS.admin.orders.update(id), data)),
  deleteOrder: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.orders.destroy(id))),
  forceDeleteOrder: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.orders.forceDelete(id))),
  restoreOrder: <T = any>(id: string | number) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.orders.restore(id))),
  updateOrderStatus: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.orders.status(id), data)),

  // Customers
  getCustomers: <T = any>() => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.customers.list)),
  createCustomer: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.customers.store, data)),
  getCustomerById: <T = any>(id: string | number) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.customers.details(id))),
  updateCustomer: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.put(API_ENDPOINTS.admin.customers.update(id), data)),
  patchCustomer: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.customers.patch(id), data)),
  deleteCustomer: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.customers.destroy(id))),

  // Couriers
  getCouriers: <T = any>() => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.couriers.list)),
  createCourier: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.couriers.store, data)),
  getTrashedCouriers: <T = any>() => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.couriers.trashed)),
  updateCourier: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.put(API_ENDPOINTS.admin.couriers.update(id), data)),
  deleteCourier: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.couriers.destroy(id))),
  forceDeleteCourier: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.couriers.forceDelete(id))),
  restoreCourier: <T = any>(id: string | number) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.couriers.restore(id))),
  toggleCourier: <T = any>(id: string | number) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.couriers.toggle(id))),

  // Cities
  createCity: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.cities.store, data)),
  updateCity: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.put(API_ENDPOINTS.admin.cities.update(id), data)),
  deleteCity: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.cities.destroy(id))),
  toggleCity: <T = any>(id: string | number) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.cities.toggle(id))),
  setCityShippingRate: <T = any, D = Record<string, any>>(cityId: string | number, data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.cities.setShippingRate(cityId), data)),
  removeCityShippingRate: <T = any>(cityId: string | number, courierId: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.cities.removeShippingRate(cityId, courierId))),

  // Countries
 getCountries: <T = any>(params?: Record<string, any>) => 
  request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.countries.index, { params })),
  createCountry: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.countries.store, data)),
  updateCountry: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.put(API_ENDPOINTS.admin.countries.update(id), data)),
  deleteCountry: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.countries.destroy(id))),
  toggleCountry: <T = any>(id: string | number) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.countries.toggle(id))),

  // Pages
  getPages: <T = any>() => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.pages.list)),
  createPage: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.pages.store, data)),
  getPageById: <T = any>(id: string | number) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.pages.details(id))),
  updatePage: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.put(API_ENDPOINTS.admin.pages.update(id), data)),
  patchPage: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.pages.patch(id), data)),
  deletePage: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.pages.destroy(id))),
  togglePageStatus: <T = any>(id: string | number) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.pages.status(id))),

  // Sections
  getSections: <T = any>() => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.sections.list)),
  createSection: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.sections.store, data)),
  getSectionById: <T = any>(id: string | number) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.sections.details(id))),
  updateSection: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.put(API_ENDPOINTS.admin.sections.update(id), data)),
  patchSection: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.sections.patch(id), data)),
  deleteSection: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.sections.destroy(id))),
  toggleSectionStatus: <T = any>(id: string | number) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.sections.status(id))),

  // Shipping
  getShippingRates: <T = any>() => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.shipping.listRates)),
  deleteShippingRate: <T = any>(rateId: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.shipping.deleteRate(rateId))),
  toggleShippingRateStatus: <T = any>(id: string | number) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.shipping.toggleRateStatus(id))),
  getCityShippingOptions: <T = any>(cityId: string | number) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.shipping.getCityOptions(cityId))),
  updateShippingRate: <T = any, D = Record<string, any>>(cityId: string | number, rateId: string | number, data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.shipping.updateRate(cityId, rateId), data)),

  // Payment Gateways
  getPaymentGateways: <T = any>() => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.paymentGateways.list)),
  createPaymentGateway: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.paymentGateways.store, data)),
  updatePaymentGateway: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.put(API_ENDPOINTS.admin.paymentGateways.update(id), data)),
  editPaymentGateway: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.paymentGateways.edit(id))),
  deletePaymentGateway: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.paymentGateways.destroy(id))),
  togglePaymentGatewayStatus: <T = any>(id: string | number) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.paymentGateways.toggleStatus(id))),
  togglePaymentGatewayTestMode: <T = any>(id: string | number) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.paymentGateways.toggleTestMode(id))),

  // Settings
  getAllSettings: <T = any>() => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.settings.getAll)),
  updateSettings: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.put(API_ENDPOINTS.admin.settings.update, data)),
};

// 3. المصادقة والبروفايل
export const authApi = {
  login: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.auth.login, data)),
  register: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.auth.register, data)),
  logout: <T = any>() => request<T>(() => axiosInstance.post(API_ENDPOINTS.auth.logout)),
  
  me: <T = any>() => request<T>(() => axiosInstance.get(API_ENDPOINTS.auth.me)),
  
  refresh: <T = any>() => request<T>(() => axiosInstance.post(API_ENDPOINTS.auth.refresh)),
  rotateRefresh: <T = any>() => request<T>(() => axiosInstance.post(API_ENDPOINTS.auth.rotateRefresh)),
  
  updateProfile: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.put(API_ENDPOINTS.profile.update, data)),
  updatePassword: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.profile.updatePassword, data)),
  updateAvatar: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.profile.updateAvatar, data)),
};

// 4. الطلبات والـ Storefront الخاصة بالمستخدم
export const orderApi = {
  getMyOrders: <T = any>() => request<T>(() => axiosInstance.get(API_ENDPOINTS.orders.myOrders)),
  createOrder: <T = any, D = Record<string, any>>(data: D, config?: any) => 
    request<T>(() => axiosInstance.post(API_ENDPOINTS.orders.create, data, config)),
  getOrderById: <T = any>(id: string | number) => request<T>(() => axiosInstance.get(API_ENDPOINTS.orders.details(id))),
  cancelOrder: <T = any, D = Record<string, any>>(id: string | number, data?: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.orders.cancel(id), data)),
};