export const NAV_LINKS = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Shop",
    href: "/shop",
  },
  {
    name: "Categories",
    href: "/categories",
  },
  {
    name: "About",
    href: "/about",
  },
  {
    name: "Contact",
    href: "/contact",
  },
] as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/auth/login",
  REGISTER: "/register",

  // Account settings
  SETTINGS: "/settings",
  SETTINGS_PROFILE: "/settings/profile",
  SETTINGS_SECURITY: "/settings/security",
  SETTINGS_ORDERS: "/settings/orders",

  // Addresses
  SETTINGS_ADDRESSES: "/settings/addresses",
  ADDRESS_CREATE: "/settings/addresses/new",
  ADDRESS_EDIT: (id: number | string) =>
    `/settings/addresses/${id}/edit`,

  SHOP: "/shop",
  DASHBOARD: "/admin",
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDERS: "/my-orders",
} as const;