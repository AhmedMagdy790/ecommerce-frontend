// src/shared/constants/routes.ts
export const ADMIN_ROUTES = {
  CMS: {
    NAVIGATION: {
      ROOT: "/admin/cms/navigation",
      ITEMS: (menuId: number | string) => `/admin/cms/navigation/${menuId}/items`,
    },
  },
};