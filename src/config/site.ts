export const defaultSettings = {
  logo: {
    text: "app.name",
    image: "/logo.svg",
    url: "/",
  },

  menu: [
    {
      labelKey: "nav.home",
      href: "/",
    },
    {
      labelKey: "nav.shop",
      href: "/shop",
    },
    {
      labelKey: "nav.categories",
      href: "/categories",
    },
    {
      labelKey: "nav.contact",
      href: "/contact",
    },
  ],

  topbar: {
    messageKey: "topbar.freeShipping",
    linkTextKey: "topbar.shopNow",
    link: "/shop",
  },
} as const;