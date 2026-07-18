import Categories from "./components/sections/Categories";
import FeaturedProducts from "./components/sections/FeaturedProducts";
import PromoBanner from "./components/sections/PromoBanner";
import BestSellers from "./components/sections/BestSellers";
import NewArrivals from "./components/sections/NewArrivals";
import WhyChooseUs from "./components/sections/WhyChooseUs";
import Testimonials from "./components/sections/Testimonials";
import Newsletter from "./components/sections/Newsletter";
import BrandLogos from "./components/sections/BrandLogos";
import HeroRenderer from "./components/hero/HeroRenderer";



export const sectionRegistry = {
  hero: HeroRenderer,
  categories: Categories,
  featuredProducts: FeaturedProducts,
  promoBanner: PromoBanner,
  bestSellers: BestSellers,
  newArrivals: NewArrivals,
  whyChooseUs: WhyChooseUs,
  testimonials: Testimonials,
  newsletter: Newsletter,
  brandLogos: BrandLogos,
};
