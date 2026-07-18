import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// English
import enCommon from "../locales/en/common.json";
import enAuth from "../locales/en/auth.json";
import enHome from "../locales/en/home.json";
import enShop from "../locales/en/shop.json";
import enProduct from "../locales/en/product.json";
import enCart from "../locales/en/cart.json";
import enCheckout from "../locales/en/checkout.json";
import enProfile from "../locales/en/profile.json";
import enOrder from "../locales/en/order.json";

// Arabic
import arCommon from "../locales/ar/common.json";
import arAuth from "../locales/ar/auth.json";
import arHome from "../locales/ar/home.json";
import arShop from "../locales/ar/shop.json";
import arProduct from "../locales/ar/product.json";
import arCart from "../locales/ar/cart.json";
import arCheckout from "../locales/ar/checkout.json";
import arProfile from "../locales/ar/profile.json";
import arOrder from "../locales/ar/order.json";

const savedLanguage = localStorage.getItem("language") || "en";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        auth: enAuth,
        home: enHome,
        shop: enShop,
        product: enProduct,
        cart: enCart,
        checkout: enCheckout,
        profile: enProfile,
        order: enOrder,
      },

      ar: {
        common: arCommon,
        auth: arAuth,
        home: arHome,
        shop: arShop,
        product: arProduct,
        cart: arCart,
        checkout: arCheckout,
        profile: arProfile,
        order: arOrder,
      },
    },

    lng: savedLanguage,
    fallbackLng: "en",

    defaultNS: "common",

    ns: [
      "common",
      "auth",
      "home",
      "product",
      "cart",
      "checkout",
      "profile",
      "order",
    ],

    interpolation: {
      escapeValue: false,
    },
  });

i18n.on("languageChanged", (lng) => {
  localStorage.setItem("language", lng);
  localStorage.setItem("direction", lng === "ar" ? "rtl" : "ltr");

  document.documentElement.lang = lng;
  document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
});

export default i18n;