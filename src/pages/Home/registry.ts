import HeroRenderer from "./components/hero/HeroRenderer";
import Newsletter from "./components/sections/Newsletter";
import FeaturedProducts from "./components/sections/FeaturedProducts";
import Categories from "./components/sections/Categories";
import PromoBanner from "./components/sections/PromoBanner";
import BestSellers from "./components/sections/BestSellers";
import NewArrivals from "./components/sections/NewArrivals";
import WhyChooseUs from "./components/sections/WhyChooseUs";
import Testimonials from "./components/sections/Testimonials";
import BrandLogos from "./components/sections/BrandLogos";
import AboutSection from "./components/sections/AboutSection";
import TextSection from "./components/sections/TextSection";
import ContactInfoSection from "./components/sections/ContactInfoSection";
import ContactSection from "./components/sections/ContactSection";
import ServicesHeroSection from "./components/sections/ServicesHeroSection";

/**
 * 1. قاموس الأنواع (Section Types Registry)
 * يُستخدم كمرجع أساسي بناءً على الـ type القادم من قاعدة البيانات (مثل HERO, BANNER, PRODUCTS).
 */
export const sectionRegistry = {
  HERO: HeroRenderer,
  SLIDER: HeroRenderer,

  PRODUCTS: FeaturedProducts,
  CATEGORY: Categories,
  BANNER: PromoBanner,
  BRANDS: BrandLogos,
  SERVICES: WhyChooseUs,
  WHYCHOOSEUS: WhyChooseUs,
  TESTIMONIALS: Testimonials,
  NEWSLETTER: Newsletter,
  TEXT: TextSection,
} as const;

/**
 * 2. قاموس المفاتيح المخصصة (Section Keys Registry)
 * يُستخدم لتوجيه مفاتيح معينة بالاسم (مثل HOME_HERO أو hero بعد تطبيعها) إلى مكونات محددة.
 */
export const sectionKeyRegistry = {
  HOME_HERO: HeroRenderer,

  FEATURED_PRODUCTS: FeaturedProducts,
  BEST_SELLERS: BestSellers,
  NEW_ARRIVALS: NewArrivals,

  ABOUT_HERO: AboutSection,
  SERVICES_HERO: ServicesHeroSection,

  CONTACT_BANNER: ContactSection,
  CONTACT_INFO: ContactInfoSection,
} as const;

/**
 * دالة توحيد المفاتيح (Normalization)
 * تقوم بإزالة المسافات، استبدال الشرط والمسافات بأقواس سفلية (_)، وحذف أي رموز غريبة، ثم تحويلها لحروف كبيرة.
 * مثال: "home-hero" أو "home hero" أو "hero" ستصبح "HOME_HERO" أو "HERO".
 */
export const normalizeSectionKey = (value?: string | null) => {
  return String(value ?? "")
    .trim()
    .replace(/[-\s]+/g, "_")
    .replace(/[^A-Z0-9_]/gi, "")
    .toUpperCase();
};

export type SectionType = keyof typeof sectionRegistry;
export type SectionKey = keyof typeof sectionKeyRegistry;