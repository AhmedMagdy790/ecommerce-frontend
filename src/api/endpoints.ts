export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    getAccessToken: "/auth/get-access-token",
    rotateRefresh: "/auth/rotate-refresh",
    me: "/auth/me",
  },

  settings: {
    getAll: "/settings"
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
    clear: "/cart/clear"
  },

  wishlist: {
    list: "/wishlist",
    add: "/wishlist",
    destroy: (id: string | number) => `/wishlist/${id}`
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
    availableRates: (cityId: string | number) => `/shipping/cities/${cityId}/rates`,
  },

  orders: {
    index: "/orders",
    myOrders: "/orders/my-orders",
    details: (id: string | number) => `/orders/${id}`,
    cancel: (id: string | number) => `/orders/${id}/cancel`,
    retryPayment: (id: string | number) => `/orders/${id}/retry-payment`,
  },

  pages: {
    bySlug: (slug: string) => `/pages/${slug}`,
  },
  
  navigation: {
    show: (location: string) => `/navigation/${location}`,
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
      index: "/admin/variants",
      store: "/admin/variants",
      details: (id: string | number) => `/admin/variants/${id}`,
      update: (id: string | number) => `/admin/variants/${id}`,
      destroy: (id: string | number) => `/admin/variants/${id}`, // Soft delete
      trashed: "/admin/variants/trashed",
      forceDelete: (id: string | number) => `/admin/variants/${id}/force`,
      restore: (id: string | number) => `/admin/variants/${id}/restore`,
      toggleStatus: (id: string | number) => `/admin/variants/${id}/toggle-status`,
    },
    inventories: {
      list: "/admin/inventories", // or relative to your baseURL
      store: "/admin/inventories",
      details: (id: string | number) => `/admin/inventories/${id}`,
      update: (id: string | number) => `/admin/inventories/${id}`,
      delete: (id: string | number) => `/admin/inventories/${id}`,
    },
    orders: {
      list: "/admin/orders",
      store: "/admin/orders",
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

    managers: {
      list: "/admin/managers",
      store: "/admin/managers",
      details: (id: string | number) => `/admin/managers/${id}`,
      update: (id: string | number) => `/admin/managers/${id}`,
      patch: (id: string | number) => `/admin/managers/${id}`,
      destroy: (id: string | number) => `/admin/managers/${id}`,

      toggle: (id: string | number) => `/admin/managers/${id}/toggle-status`,


      getRoles: (id: string | number) => `/admin/managers/${id}/roles`,
      updateRoles: (id: string | number) => `/admin/managers/${id}/roles`,
    },

    roles: {
      list: "/admin/roles",
      permissionsList: "/admin/roles/permissions",
      details: (id: string | number) => `/admin/roles/${id}`,
      updatePermissions: (id: string | number) =>
        `/admin/roles/${id}/permissions`,
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
      index: () => `/admin/countries/cities`,
      listByCountry: (id: string | number) => `/admin/countries/${id}/cities-list`,
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
      countrieImport: () => `/admin/countries/import`
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
    navigation: {
      list: "/admin/navigation",
      store: "/admin/navigation",
      details: (id: string | number) => `/admin/navigation/${id}`,
      update: (id: string | number) => `/admin/navigation/${id}`,
      patch: (id: string | number) => `/admin/navigation/${id}`,
      destroy: (id: string | number) => `/admin/navigation/${id}`,
      status: (id: string | number) => `/admin/navigation/${id}/toggle-status`, 
      getLocations: () => `/admin/navigation/locations`,
      
      items: {
        store: (menuId: string | number) => `/admin/navigation/${menuId}/items`,
        update: (itemId: string | number) => `/admin/navigation/items/${itemId}`,
        destroy: (itemId: string | number) => `/admin/navigation/items/${itemId}`,
      },
    },
    sections: {
      list: "/admin/sections",
      store: "/admin/sections",
      details: (id: string | number) => `/admin/sections/${id}`,
      update: (id: string | number) => `/admin/sections/${id}`,
      patch: (id: string | number) => `/admin/sections/${id}`,
      destroy: (id: string | number) => `/admin/sections/${id}`,
      status: (id: string | number) => `/admin/sections/${id}/status`,
      
      // === أضف مسارات عناصر الأقسام هنا ===
      items: {
        list: (sectionId: string | number) => `/admin/sections/${sectionId}/items`,
        store: (sectionId: string | number) => `/admin/sections/${sectionId}/items`,
        reorder: (sectionId: string | number) => `/admin/sections/${sectionId}/items/reorder`,
        details: (itemId: string | number) => `/admin/section-items/${itemId}`,
        update: (itemId: string | number) => `/admin/section-items/${itemId}`,
        patch: (itemId: string | number) => `/admin/section-items/${itemId}`,
        destroy: (itemId: string | number) => `/admin/section-items/${itemId}`,
      },
    },

    shipping: {
      listRates: "/admin/shipping/rates",
      storeRate: (cityId: string | number) => `/admin/shipping/cities/${cityId}/rates`,
      updateRate: (cityId: string | number, rateId: string | number) => `/admin/shipping/cities/${cityId}/rates/${rateId}`,
      deleteRate: (rateId: string | number) => `/admin/shipping/rates/${rateId}`,
      toggleRateStatus: (id: string | number) => `/admin/shipping/rates/${id}/status`,
      getCityOptions: (cityId: string | number) => `/admin/shipping/cities/${cityId}/options`,
    },

    paymentGateways: {
      list: "/admin/payment-gateways",
      trashed: "/admin/payment-gateways/trashed",
      store: "/admin/payment-gateways",
      show: (id: string | number) => `/admin/payment-gateways/${id}`,
      update: (id: string | number) => `/admin/payment-gateways/${id}`,
      edit: (id: string | number) => `/admin/payment-gateways/${id}`,
      destroy: (id: string | number) => `/admin/payment-gateways/${id}`,
      restore: (id: string | number) => `/admin/payment-gateways/${id}/restore`,
      forceDestroy: (id: string | number) => `/admin/payment-gateways/${id}/force`,
      toggleStatus: (id: string | number) => `/admin/payment-gateways/${id}/toggle-status`,
      toggleTestMode: (id: string | number) => `/admin/payment-gateways/${id}/toggle-test-mode`,
      paymentGatewayOptions: "/admin/payment-gateways/options",
    },
    
    settings: {
      update: "/admin/settings"
    }

  },

  paymentGateways: "/payment-gateways",
  
  payments: {
    getGateways: "/payment-gateways",
    paypalCapture: "/payment-gateways/paypal/capture",
    stripeStatus: "/payment-gateways/stripe/verify",
  },

  checkoutShipping: "/checkout/shipping",
  

  geo: {
    countries: "/locations/countries",
    cities: (countryId: string | number) => `/locations/countries/${countryId}/cities`,
  }
};
