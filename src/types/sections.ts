export type SectionType = 
  | "hero" 
  | "featuredProducts" 
  | "promoBanner" 
  | "bestSellers" 
  | "newArrivals" 
  | "whyChooseUs" 
  | "newsletter" 
  | "brandLogos";

export interface Section {
  type: SectionType;
  data: any;
}