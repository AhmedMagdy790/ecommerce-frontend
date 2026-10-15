// إدارة الـ Query Keys بشكل مركزي لمنع الأخطاء المطبعية وسهولة الـ Invalidation
export const navigationKeys = {
  all: ["navigation"] as const,
  menus: () => [...navigationKeys.all, "menu"] as const,
  menuByLocation: (location: string, lang: string) =>
    [...navigationKeys.menus(), location, lang] as const,
};