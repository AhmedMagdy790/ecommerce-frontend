// types/sections.ts

import type { CollectionHeroData, LuxuryHeroData } from "@/pages/Home/components/hero/HeroRenderer";


// Define the interface for every section type
export type Section = 
  | { type: 'hero'; data: CollectionHeroData | LuxuryHeroData }
  | { type: 'categories'; data: { title: string; items: any[] } }
  | { type: 'featuredProducts'; data: { limit: number; categoryId: string } }
  | { type: 'promoBanner'; data: { text: string; link: string } }
  // Add more sections here as you build them
  | { type: 'newsletter'; data: { heading: string } };

// This ensures that 'type' is the discriminator