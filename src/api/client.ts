import axiosInstance from "@/api/axios-instance"; 
import { API_ENDPOINTS } from "@/api/endpoints";
import { handleApiError } from "@/api/error";
import type { EntityId } from "@/shared/types/entity";
import type { AxiosRequestConfig } from "axios";
import toast from "react-hot-toast";


interface RequestOptions {
  showSuccess?: boolean;
}

const request = async <T = unknown>(
  fn: () => Promise<{ data: T }>,
  options?: RequestOptions
): Promise<T> => {
  try {
    const response = await fn();
    const payload = response.data as T & { message?: string };


    if (options?.showSuccess && payload.message) {
      toast.success(payload.message);
    }

    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};


// 1. واجهة المستخدم (Storefront API)
export const storeApi = {
  getProducts: <T = any>(params?: Record<string, any>) => request<T>(() => axiosInstance.get(API_ENDPOINTS.products.list, { params })),
  getProductById: <T = any>(slug: string) => request<T>(() => axiosInstance.get(API_ENDPOINTS.products.bySlug(slug))),
  
  getCategories: <T = any>(params?: Record<string, any>) => request<T>(() => axiosInstance.get(API_ENDPOINTS.categories.list, { params })),
  getCategoryById: <T = any>(id: string | number) => request<T>(() => axiosInstance.get(API_ENDPOINTS.categories.details(id))),
  
  getCart: <T = any>() => request<T>(() => axiosInstance.get(API_ENDPOINTS.cart.list)),
  addToCart: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.cart.add, data)),
  removeFromCart: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.cart.destroy(id))),
  clearCart: <T = any>() => request<T>(() => axiosInstance.delete(API_ENDPOINTS.cart.clear)),
  
  getCheckout: <T = any>() => request<T>(() => axiosInstance.get(API_ENDPOINTS.checkout.index)),
  submitCheckout: <T = any, D = Record<string, any>>(data: D, config?: any) => request<T>(() => axiosInstance.post(API_ENDPOINTS.checkout.store, data, config)),

  applyCoupon: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.checkout.applyCoupon, data)),
  removeCoupon: <T = any>() => request<T>(() => axiosInstance.delete(API_ENDPOINTS.checkout.removeCoupon)),
  setCheckoutShipping: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.checkout.shipping, data)),


  // Shipping
  optionsShipping: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post( API_ENDPOINTS.shipping.options, data)),
  calculateShipping: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.shipping.calculate, data)),
  availableRatesShipping: <T = any>(
    cityId: string | number,
    params: { weight: number; subtotal: number; payment_method?: string }) => request<T>(() => axiosInstance.get(API_ENDPOINTS.shipping.availableRates(cityId), { params })),


  getAddresses: <T = any>(params?: Record<string, any>) => request<T>(() => axiosInstance.get(API_ENDPOINTS.addresses.list, { params })),
  createAddress: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.addresses.store, data)),
  getAddressById: <T = any>(id: string | number) => request<T>(() => axiosInstance.get(API_ENDPOINTS.addresses.details(id))),
  updateAddress: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.put(API_ENDPOINTS.addresses.update(id), data)),
  deleteAddress: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.addresses.destroy(id))),
  setDefaultAddress: <T = any>(id: string | number) => request<T>(() => axiosInstance.post(API_ENDPOINTS.addresses.setDefault(id))),

  getPageBySlug: <T = any>(slug: string) => 
    request<T>(() => axiosInstance.get(API_ENDPOINTS.pages.bySlug(slug))), 

  getNavigationMenu: <T = any>(location: string = 'header') => 
    request<T>(() => axiosInstance.get(API_ENDPOINTS.navigation.show(location))), 

  getSectionById: <T = any>(id: string | number) => 
    request<T>(() => axiosInstance.get(API_ENDPOINTS.sections.bySlug(String(id)))),

  getCountries: <T = any>() => request<T>(() => axiosInstance.get(API_ENDPOINTS.geo.countries)),
  getCities: <T = any>(countryId: string | number) => request<T>(() => axiosInstance.get(API_ENDPOINTS.geo.cities(countryId))),
  checkoutShipping: <T = any, D = Record<string, any>>(data: D) =>
  request<T>(() =>
    axiosInstance.post(API_ENDPOINTS.checkoutShipping, data)
  ),
  getPaymentGateways: <T = any>() => request<T>(() => axiosInstance.get(API_ENDPOINTS.paymentGateways)),
};

// 2. واجهة الإدارة (Admin API)
export const adminApi = {
  // Categories
  getCategories: <T = any>(params?: Record<string, any>) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.categories.list, { params })),
  createCategory: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.categories.store, data), { showSuccess: true }),
  getTrashedCategories: <T = any>(params?: Record<string, any>) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.categories.trashed, { params })),
  getCategoryById: <T = any>(id: string | number) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.categories.details(id))),
  updateCategory: <T = any, D = Record<string, any>>(id: string | number, data: D, config?: AxiosRequestConfig) => request<T>(() => axiosInstance.put(API_ENDPOINTS.admin.categories.update(id), data, config)),
  patchCategory: <T = any, D = Record<string, any>>(id: string | number, data: D, config?: AxiosRequestConfig) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.categories.patch(id), data, config), { showSuccess: true}),
  deleteCategory: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.categories.destroy(id)), { showSuccess: true }),
  forceDeleteCategory: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.categories.forceDelete(id)), { showSuccess: true }),
  restoreCategory: <T = any>(id: string | number) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.categories.restore(id)), { showSuccess: true }),
  toggleCategoryStatus: <T = any>(id: string | number) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.categories.status(id)), {showSuccess: true}),

  // Products
  getProducts: <T = any>(params?: Record<string, any>) => 
    request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.products.list, { params })),
  getTrashedProducts: <T = any>(params?: Record<string, any>) => 
    request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.products.trashed, { params })),
  createProduct: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.products.store, data), { showSuccess: true}),
  updateProduct: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.products.update(id), data), { showSuccess: true}),
  deleteProduct: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.products.destroy(id))),
  forceDeleteProduct: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.products.forceDelete(id))),
  restoreProduct: <T = any>(id: string | number) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.products.restore(id))),
  toggleProductStatus: <T = any>(id: string | number) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.products.toggleStatus(id))),

  // Variants
  getVariants: <T = any, P = Record<string, any>>(params?: P) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.variants.index, { params })),
  createVariant: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.variants.store, data)),
  getTrashedVariants: <T = any, P = Record<string, any>>(params?: P) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.variants.trashed, { params })),
  getVariantById: <T = any>(id: string | number) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.variants.details(id))),
  updateVariant: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.put(API_ENDPOINTS.admin.variants.update(id), data)),
  deleteVariant: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.variants.destroy(id))), // Soft delete
  forceDeleteVariant: <T = any>(id: string | number) =>  request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.variants.forceDelete(id))),
  restoreVariant: <T = any>(id: string | number) =>  request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.variants.restore(id))),
  toggleVariantStatus: <T = any>(id: string | number) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.variants.toggleStatus(id))),

  // Inventories
  getInventories: <T = any, P = Record<string, any>>(params?: P) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.inventories.list, { params })),
  createInventory: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.inventories.store, data), { showSuccess: true }),
  getInventoryById: <T = any>(id: string | number) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.inventories.details(id))),
  updateInventory: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.put(API_ENDPOINTS.admin.inventories.update(id), data), { showSuccess: true }),
  deleteInventory: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.inventories.delete(id)), { showSuccess: true }),


  // Orders
  getOrders: <T = any>(params?: Record<string, any>) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.orders.list, { params })),
  getTrashedOrders: <T = any>(params?: Record<string, any>) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.orders.trashed, { params })),
  getOrderById: <T = any>(id: string | number) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.orders.details(id))),
  updateOrder: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.put(API_ENDPOINTS.admin.orders.update(id), data)),
  createOrder: <T = any, D = Record<string, any>>(data: D) => 
    request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.orders.store, data), { showSuccess: true }),
  deleteOrder: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.orders.destroy(id))),
  forceDeleteOrder: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.orders.forceDelete(id))),
  restoreOrder: <T = any>(id: string | number) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.orders.restore(id))),
  updateOrderStatus: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.orders.status(id), data)),

  // Customers
  getCustomers: <T = any>(params?: Record<string, any>) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.customers.list, { params })),
  createCustomer: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.customers.store, data)),
  getCustomerById: <T = any>(id: string | number) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.customers.details(id))),
  updateCustomer: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.put(API_ENDPOINTS.admin.customers.update(id), data), { showSuccess: true}),
  patchCustomer: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.customers.patch(id), data), { showSuccess: true}),
  deleteCustomer: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.customers.destroy(id)), { showSuccess: true}),

  // Roles
  getRoles: <T = any>(params?: Record<string, any>) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.roles.list, { params })),
  getAllPermissions: <T = any>() => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.roles.permissionsList)),
  getRoleById: <T = any>(id: EntityId) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.roles.details(id))),
  updateRolePermissions: <T = any, D = any>(id: EntityId, data: D) => request<T>(() => axiosInstance.put(API_ENDPOINTS.admin.roles.updatePermissions(id), data), { showSuccess: true }),


  // Manger
  getAdminRoles: <T = any>(id: EntityId) => request<T>(() => axiosInstance.get( API_ENDPOINTS.admin.managers.getRoles(id))),
  updateAdminRoles: <T = unknown, D = { roles: EntityId[] }>(id: EntityId, data: D ) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.managers.updateRoles(id), data),{ showSuccess: true }),
  toggleAdminStatus: <T = unknown, D = unknown>(id: EntityId, data: D) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.managers.toggle(id), data),{ showSuccess: true }),
  getManagers: <T = any>(params?: Record<string, any>) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.managers.list, { params })),
  createManager: <T = any, D = any>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.managers.store, data), { showSuccess: true }),
  getManagerById: <T = any>(id: EntityId) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.managers.details(id))),
  updateManager: <T = any, D = any>(id: EntityId, data: D) => request<T>(() => axiosInstance.put(API_ENDPOINTS.admin.managers.update(id), data), { showSuccess: true }),  
  patchManager: <T = any, D = any>(id: EntityId, data: D) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.managers.patch(id), data), { showSuccess: true }), // تم تصحيح id هنا
  deleteManager: <T = any>(id: EntityId) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.managers.destroy(id)), { showSuccess: true }),



  // Couriers
  getCouriers: <T = any>(params?: Record<string, any>) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.couriers.list, { params })),
  createCourier: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.couriers.store, data)),
  getTrashedCouriers: <T = any>(params?: Record<string, any>) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.couriers.trashed, { params })),
  updateCourier: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.put(API_ENDPOINTS.admin.couriers.update(id), data), { showSuccess: true}),
  deleteCourier: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.couriers.destroy(id)), { showSuccess: true}),
  forceDeleteCourier: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.couriers.forceDelete(id)), { showSuccess: true}),
  restoreCourier: <T = any>(id: string | number) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.couriers.restore(id)), { showSuccess: true}),
  toggleCourier: <T = any>(id: string | number) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.couriers.toggle(id)), { showSuccess: true}),

  // Cities
  getCities: <T = any>( params?: Record<string, any>) => 
    request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.cities.index(), { params })),
  getCitiesListByCountry: <T = any>(countryId: string | number) => 
    request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.cities.listByCountry(countryId))),
  createCity: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.cities.store, data)),
  updateCity: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.put(API_ENDPOINTS.admin.cities.update(id), data)),
  deleteCity: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.cities.destroy(id))),
  toggleCity: <T = any>(id: string | number) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.cities.toggle(id))),
  setCityShippingRate: <T = any, D = Record<string, any>>(cityId: string | number, data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.cities.setShippingRate(cityId), data)),
  removeCityShippingRate: <T = any>(cityId: string | number, courierId: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.cities.removeShippingRate(cityId, courierId))),

  // Countries
 getCountries: <T = any>(params?: Record<string, any>) => 
  request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.countries.index, { params })),
  createCountry: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.countries.store, data), { showSuccess: true }),
  updateCountry: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.put(API_ENDPOINTS.admin.countries.update(id), data), { showSuccess: true }),
  deleteCountry: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.countries.destroy(id)), { showSuccess: true }),
  toggleCountry: <T = any>(id: string | number) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.countries.toggle(id)), { showSuccess: true }),
  countrieImport: <T = any>() => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.countries.countrieImport(), {}, {
    timeout: 180000
  })),

  // Pages
  getPages: <T = any>(params?: Record<string, any>) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.pages.list, {params})),
  createPage: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.pages.store, data), { showSuccess: true } ),
  getPageById: <T = any>(id: string | number) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.pages.details(id))),
  updatePage: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.put(API_ENDPOINTS.admin.pages.update(id), data)),
  patchPage: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.pages.patch(id), data), { showSuccess: true}),
  deletePage: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.pages.destroy(id)), { showSuccess: true }),
  togglePageStatus: <T = any>(id: string | number) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.pages.status(id))),

  // NavMenus
  getMenus: <T = any>(params?: Record<string, any>) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.navigation.list, { params })),
  createMenu: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.navigation.store, data), { showSuccess: true }),
  getMenuById: <T = any>(id: string | number) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.navigation.details(id))),
  updateMenu: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.put(API_ENDPOINTS.admin.navigation.update(id), data), { showSuccess: true }),
  patchMenu: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.navigation.patch(id), data), { showSuccess: true }),
  deleteMenu: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.navigation.destroy(id)), { showSuccess: true }),
  toggleMenuStatus: <T = any>(id: string | number) =>  request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.navigation.status(id)), { showSuccess: true }),
  getLocations: <T = any>() =>  request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.navigation.getLocations())),

  // NavMenuItems
  createMenuItem: <T = any, D = Record<string, any>>(menuId: string | number, data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.navigation.items.store(menuId), data), { showSuccess: true }),
  updateMenuItem: <T = any, D = Record<string, any>>(itemId: string | number, data: D) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.navigation.items.update(itemId), data), { showSuccess: true }),
  deleteMenuItem: <T = any>(itemId: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.navigation.items.destroy(itemId)), { showSuccess: true }),

  // Sections
  getSections: <T = any>(params?: Record<string, any>) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.sections.list, { params })),
  createSection: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.sections.store, data), { showSuccess: true }),
  getSectionById: <T = any>(id: string | number) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.sections.details(id))),
  updateSection: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.put(API_ENDPOINTS.admin.sections.update(id), data), { showSuccess: true }),
  patchSection: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.sections.patch(id), data), { showSuccess: true }),
  deleteSection: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.sections.destroy(id)), { showSuccess: true }),
  toggleSectionStatus: <T = any>(id: string | number) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.sections.status(id)), { showSuccess: true }),

  // Section Items
  getSectionItems: <T = any>(sectionId: string | number, params?: Record<string, any>) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.sections.items.list(sectionId), { params })),
  createSectionItem: <T = any, D = Record<string, any>>(sectionId: string | number, data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.sections.items.store(sectionId), data), { showSuccess: true }),
  getSectionItemById: <T = any>(itemId: string | number) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.sections.items.details(itemId))),
  updateSectionItem: <T = any, D = Record<string, any>>(itemId: string | number, data: D) => request<T>(() => axiosInstance.put(API_ENDPOINTS.admin.sections.items.update(itemId), data), { showSuccess: true }),
  patchSectionItem: <T = any, D = Record<string, any>>(itemId: string | number, data: D) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.sections.items.patch(itemId), data), { showSuccess: true }),
  deleteSectionItem: <T = any>(itemId: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.sections.items.destroy(itemId)), { showSuccess: true }),
  reorderSectionItems: <T = any, D = Record<string, any>>(sectionId: string | number, data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.sections.items.reorder(sectionId), data), { showSuccess: true }),


  // Shipping
  getShippingRates: <T = any>(params?: Record<string, any>) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.shipping.listRates, { params })),
  deleteShippingRate: <T = any>(rateId: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.shipping.deleteRate(rateId))),
  toggleShippingRateStatus: <T = any>(id: string | number) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.shipping.toggleRateStatus(id))),
  getCityShippingOptions: <T = any>(cityId: string | number) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.shipping.getCityOptions(cityId))),
  updateShippingRate: <T = any, D = Record<string, any>>(cityId: string | number, rateId: string | number, data: D) => 
    request<T>(() => axiosInstance.put(API_ENDPOINTS.admin.shipping.updateRate(cityId, rateId), data)),

  storeShippingRate: <T = any, D = Record<string, any>>(cityId: string | number, data: D) => 
    request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.shipping.storeRate(cityId), data)),


  // Payment Gateways
  getPaymentGateways: <T = any>(params?: Record<string, any>) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.paymentGateways.list, { params })),
  createPaymentGateway: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.admin.paymentGateways.store, data)),
  updatePaymentGateway: <T = any, D = Record<string, any>>(id: string | number, data: D) => request<T>(() => axiosInstance.put(API_ENDPOINTS.admin.paymentGateways.update(id), data)),
  editPaymentGateway: <T = any>(id: string | number) => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.paymentGateways.edit(id))),
  deletePaymentGateway: <T = any>(id: string | number) => request<T>(() => axiosInstance.delete(API_ENDPOINTS.admin.paymentGateways.destroy(id))),
  togglePaymentGatewayStatus: <T = any>(id: string | number) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.paymentGateways.toggleStatus(id))),
  togglePaymentGatewayTestMode: <T = any>(id: string | number) => request<T>(() => axiosInstance.patch(API_ENDPOINTS.admin.paymentGateways.toggleTestMode(id))),
  getPaymentGatewayOptions: <T = any>() => request<T>(() => axiosInstance.get(API_ENDPOINTS.admin.paymentGateways.paymentGatewayOptions)),

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
};

export const profileApi = {
  updateProfile: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.put(API_ENDPOINTS.profile.update, data), { showSuccess: true }),
  updatePassword: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.profile.updatePassword, data), { showSuccess: true }),
  updateAvatar: <T = any, D = Record<string, any>>(data: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.profile.updateAvatar, data), { showSuccess: true }),
};

// 4. الطلبات والـ Storefront الخاصة بالمستخدم
export const orderApi = {
  getMyOrders: <T = any>() => request<T>(() => axiosInstance.get(API_ENDPOINTS.orders.myOrders)),
  getOrderById: <T = any>(id: string | number) => request<T>(() => axiosInstance.get(API_ENDPOINTS.orders.details(id))),
  cancelOrder: <T = any, D = Record<string, any>>(id: string | number, data?: D) => request<T>(() => axiosInstance.post(API_ENDPOINTS.orders.cancel(id), data)),
};