// src/pages/Home/registry.ts
import HeroRenderer from "./components/hero/HeroRenderer";
import Categories from "./components/sections/Categories";
import FeaturedProducts from "./components/sections/FeaturedProducts";
import PromoBanner from "./components/sections/PromoBanner";
import BestSellers from "./components/sections/BestSellers";
import NewArrivals from "./components/sections/NewArrivals";
import WhyChooseUs from "./components/sections/WhyChooseUs";
import Testimonials from "./components/sections/Testimonials";
import Newsletter from "./components/sections/Newsletter";
import BrandLogos from "./components/sections/BrandLogos";

export const sectionRegistry = {
  HERO: HeroRenderer,
  SLIDER: HeroRenderer,
  PRODUCTS: FeaturedProducts,
  // CATEGORY: Categories,
  // BANNER: PromoBanner,
  // BRANDS: BrandLogos,
  // SERVICES: WhyChooseUs,
  // TESTIMONIALS: Testimonials,
  // NEWSLETTER: Newsletter,
  // TEXT: PromoBanner,
} as const;

export const sectionKeyRegistry = {
  hero: HeroRenderer,
  // categories: Categories,
  // featured_products: FeaturedProducts,
  // promo_banner: PromoBanner,
  // best_sellers: BestSellers,
  // new_arrivals: NewArrivals,
  // why_choose_us: WhyChooseUs,
  // testimonials: Testimonials,
  newsletter: Newsletter,
  // brands: BrandLogos,
} as const;


export type SectionType = keyof typeof sectionRegistry;

export type SectionKey = keyof typeof sectionKeyRegistry;