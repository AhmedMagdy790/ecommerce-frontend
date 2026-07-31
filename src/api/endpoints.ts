export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/logout",
    refresh: "/auth/refresh",
    rotateRefresh: "/auth/rotate-refresh",
    me: "/auth/me",
  },

  profile: {
    update: "/profile/update",
    updatePassword: "/profile/update-password",
    updateAvatar: "/profile/update-avatar",
  },

  addresses: {
    list: "/addresses",
    store: "/addresses",
    details: (id: string | number) => `/addresses/${id}`,
    update: (id: string | number) => `/addresses/${id}`,
    destroy: (id: string | number) => `/addresses/${id}`,
    setDefault: (id: string | number) => `/addresses/${id}/default`,
  },

  products: {
    list: "/products",
    bySlug: (slug: string) => `/products/${slug}`,
  },

  categories: {
    list: "/categories",
    details: (id: string | number) => `/categories/${id}`,
  },

  cart: {
    list: "/cart",
    add: "/cart",
    destroy: (id: string | number) => `/cart/${id}`,
  },

  checkout: {
    index: "/checkout",
    store: "/checkout",
    applyCoupon: "/checkout/coupon",
    removeCoupon: "/checkout/coupon",
    shipping: "/checkout/shipping",
  },

  shipping: {
    options: "/shipping/options",
    calculate: "/shipping/calculate",
  },

  orders: {
    index: "/orders",
    myOrders: "/my-orders",
    create: "/orders",
    details: (id: string | number) => `/orders/${id}`,
    cancel: (id: string | number) => `/orders/${id}/cancel`,
  },

  pages: {
    bySlug: (slug: string) => `/pages/${slug}`,
  },

  sections: {
    bySlug: (slug: string) => `/sections/${slug}`,
  },

  admin: {
    categories: {
      list: "/admin/categories",
      store: "/admin/categories",
      trashed: "/admin/categories/trashed",
      details: (id: string | number) => `/admin/categories/${id}`,
      update: (id: string | number) => `/admin/categories/${id}`,
      patch: (id: string | number) => `/admin/categories/${id}`,
      destroy: (id: string | number) => `/admin/categories/${id}`,
      forceDelete: (id: string | number) => `/admin/categories/${id}/force`,
      restore: (id: string | number) => `/admin/categories/${id}/restore`,
      status: (id: string | number) => `/admin/categories/${id}/status`,
    },
    products: {
      list: "/admin/products",
      store: "/admin/products",
      trashed: "/admin/products/trashed",
      update: (id: string | number) => `/admin/products/${id}`,
      destroy: (id: string | number) => `/admin/products/${id}`,
      forceDelete: (id: string | number) => `/admin/products/${id}/force`,
      restore: (id: string | number) => `/admin/products/${id}/restore`,
      toggleStatus: (id: string | number) => `/admin/products/${id}/toggle-status`,
    },
    variants: {
      store: "/admin/variants",
      trashed: "/admin/variants/trashed",
      details: (id: string | number) => `/admin/variants/${id}`,
      update: (id: string | number) => `/admin/variants/${id}`,
      forceDelete: (id: string | number) => `/admin/variants/${id}/force`,
      restore: (id: string | number) => `/admin/variants/${id}/restore`,
      stock: (id: string | number) => `/admin/variants/${id}/stock`,
      toggleStatus: (id: string | number) => `/admin/variants/${id}/toggle-status`,
    },
    orders: {
      list: "/admin/orders",
      trashed: "/admin/orders/trashed",
      details: (id: string | number) => `/admin/orders/${id}`,
      update: (id: string | number) => `/admin/orders/${id}`,
      destroy: (id: string | number) => `/admin/orders/${id}`,
      forceDelete: (id: string | number) => `/admin/orders/${id}/force`,
      restore: (id: string | number) => `/admin/orders/${id}/restore`,
      status: (id: string | number) => `/admin/orders/${id}/status`,
    },
    customers: {
      list: "/admin/customers",
      store: "/admin/customers",
      details: (id: string | number) => `/admin/customers/${id}`,
      update: (id: string | number) => `/admin/customers/${id}`,
      patch: (id: string | number) => `/admin/customers/${id}`,
      destroy: (id: string | number) => `/admin/customers/${id}`,
    },
    couriers: {
      list: "/admin/couriers",
      store: "/admin/couriers",
      trashed: "/admin/couriers/trashed",
      update: (id: string | number) => `/admin/couriers/${id}`,
      destroy: (id: string | number) => `/admin/couriers/${id}`,
      forceDelete: (id: string | number) => `/admin/couriers/${id}/force`,
      restore: (id: string | number) => `/admin/couriers/${id}/restore`,
      toggle: (id: string | number) => `/admin/couriers/${id}/toggle`,
    },
    cities: {
      store: "/admin/cities",
      update: (id: string | number) => `/admin/cities/${id}`,
      destroy: (id: string | number) => `/admin/cities/${id}`,
      toggle: (id: string | number) => `/admin/cities/${id}/toggle`,
      setShippingRate: (cityId: string | number) => `/admin/cities/${cityId}/shipping-rates/set`,
      removeShippingRate: (cityId: string | number, courierId: string | number) => `/admin/cities/${cityId}/shipping-rates/${courierId}`,
    },
    countries: {
      index: "/admin/countries",
      store: "/admin/countries",
      update: (id: string | number) => `/admin/countries/${id}`,
      destroy: (id: string | number) => `/admin/countries/${id}`,
      toggle: (id: string | number) => `/admin/countries/${id}/toggle`,
    },
    pages: {
      list: "/admin/pages",
      store: "/admin/pages",
      details: (id: string | number) => `/admin/pages/${id}`,
      update: (id: string | number) => `/admin/pages/${id}`,
      patch: (id: string | number) => `/admin/pages/${id}`,
      destroy: (id: string | number) => `/admin/pages/${id}`,
      status: (id: string | number) => `/admin/pages/${id}/status`,
    },
    sections: {
      list: "/admin/sections",
      store: "/admin/sections",
      details: (id: string | number) => `/admin/sections/${id}`,
      update: (id: string | number) => `/admin/sections/${id}`,
      patch: (id: string | number) => `/admin/sections/${id}`,
      destroy: (id: string | number) => `/admin/sections/${id}`,
      status: (id: string | number) => `/admin/sections/${id}/status`,
    },
    shipping: {
      listRates: "/admin/shipping/rates",
      deleteRate: (rateId: string | number) => `/admin/shipping/rates/${rateId}`,
      toggleRateStatus: (id: string | number) => `/admin/shipping/rates/${id}/status`,
      getCityOptions: (cityId: string | number) => `/admin/shipping/cities/${cityId}/options`,
      updateRate: (cityId: string | number, rateId: string | number) => `/admin/shipping/cities/${cityId}/rates/${rateId}`,
    },
    paymentGateways: {
      list: "/admin/payment-gateways",
      store: "/admin/payment-gateways",
      update: (id: string | number) => `/admin/payment-gateways/${id}`,
      edit: (id: string | number) => `/admin/payment-gateways/${id}`,
      destroy: (id: string | number) => `/admin/payment-gateways/${id}`,
      toggleStatus: (id: string | number) => `/admin/payment-gateways/${id}/toggle-status`,
      toggleTestMode: (id: string | number) => `/admin/payment-gateways/${id}/toggle-test-mode`,
    },
    settings: {
      getAll: "/admin/settings",
      update: "/admin/settings"
    }

  },

  paymentGateways: "/payment-gateways",
  checkoutShipping: "/checkout/shipping",
  

  geo: {
    countries: "/countries",
    cities: (countryId: string | number) => `/countries/${countryId}/cities`,
    shippingCouriers: (cityId: string | number) => `/cities/${cityId}/shipping-couriers`,
  }
};