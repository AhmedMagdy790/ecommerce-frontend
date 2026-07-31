// src/pages/Shop/CategoryPage.tsx

import { useState } from "react";
import { useParams } from "react-router-dom";

import { useLang } from "@/shared/context/LanguageContext";
import ShopHero from "../Shop/components/ShopHero";
import ProductGrid from "../Shop/components/ProductGrid";
import ShopFilters from "../Shop/components/ShopFilters/ShopFilters";

// Mock database or API response simulation for category pages
const categoryDatabase: Record<string, {
  hero: {
    title: { ar: string; en: string };
    description: { ar: string; en: string };
    image?: string;
  };
  products: Array<{
    id: string;
    slug: string;
    name: { ar: string; en: string };
    image: string;
    price: number;
    oldPrice?: number;
    category?: { slug: string; name: { ar: string; en: string } };
  }>;
}> = {
  watches: {
    hero: {
      title: { ar: "قسم الساعات الفاخرة", en: "Luxury Watches Collection" },
      description: { ar: "تألق بإطلالة استثنائية مع تشكيلة من أحدث وأرقى الساعات العصرية.", en: "Shine with an exceptional look featuring our latest and finest modern timepieces." },
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    },
    products: [
      {
        id: "w-1",
        slug: "classic-metallic-watch",
        name: { ar: "ساعة كلاسيكية معدنية", en: "Classic Metallic Watch" },
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        price: 150,
        oldPrice: 190,
        category: { slug: "watches", name: { ar: "ساعات عصرية", en: "Modern Watches" } },
      },
      {
        id: "w-2",
        slug: "digital-sport-watch",
        name: { ar: "ساعة رقمية رياضية", en: "Digital Sport Watch" },
        image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1",
        price: 95,
        category: { slug: "watches", name: { ar: "ساعات عصرية", en: "Modern Watches" } },
      }
    ]
  },
  shoes: {
    hero: {
      title: { ar: "قسم الأحذية العصرية", en: "Sneakers & Shoes Collection" },
      description: { ar: "راحة تامة وأناقة لا مثيل لها لكل خطواتك اليومية والرياضية.", en: "Ultimate comfort and unmatched style for all your daily and athletic steps." },
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    },
    products: [
      {
        id: "s-1",
        slug: "red-sport-sneaker",
        name: { ar: "حذاء رياضي جينز أحمر", en: "Red Sport Sneaker" },
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        price: 85,
        oldPrice: 110,
        category: { slug: "shoes", name: { ar: "أحذية رياضية", en: "Sneakers & Shoes" } },
      },
      {
        id: "s-2",
        slug: "classic-casual-shoe",
        name: { ar: "حذاء كжуال كلاسيكي", en: "Classic Casual Shoe" },
        image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77",
        price: 70,
        category: { slug: "shoes", name: { ar: "أحذية رياضية", en: "Sneakers & Shoes" } },
      }
    ]
  }
};

const defaultCategoryData = {
  hero: {
    title: { ar: "قسم المنتجات العامة", en: "General Category Collection" },
    description: { ar: "تصفح أحدث المنتجات والعروض الحصرية المتاحة في المتجر.", en: "Browse the latest products and exclusive offers available in the store." },
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
  },
  products: [
    {
      id: "d-1",
      slug: "stylish-sunglasses",
      name: { ar: "نظارة شمسية أنيقة", en: "Stylish Sunglasses" },
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f",
      price: 45,
      category: { slug: "accessories", name: { ar: "إكسسوارات فاخرة", en: "Luxury Accessories" } },
    }
  ]
};

const globalFilters = {
  categories: [
    { id: "1", name: { ar: "ساعات عصرية", en: "Modern Watches" }, slug: "watches" },
    { id: "2", name: { ar: "أحذية رياضية", en: "Sneakers & Shoes" }, slug: "shoes" },
    { id: "3", name: { ar: "إكسسوارات فاخرة", en: "Luxury Accessories" }, slug: "accessories" },
  ],
  price: {
    min: 0,
    max: 1000
  }
};

export default function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const { lang, isRTL } = useLang();

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categorySlug ? [categorySlug] : []
  );
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: "", max: "" });

  // Pick category data or fallback to general data
  const currentData = (categorySlug && categoryDatabase[categorySlug]) || defaultCategoryData;

  // Adapt hero text dynamically based on the current active language
  const localizedHero = {
    title: currentData.hero.title[lang as keyof typeof currentData.hero.title] || currentData.hero.title.en,
    description: currentData.hero.description[lang as keyof typeof currentData.hero.description] || currentData.hero.description.en,
    image: currentData.hero.image,
  };

  // Filter products based on selected categories and price range
  const filteredProductsList = currentData.products.filter((product) => {
    // Category filter check
    if (selectedCategories.length > 0) {
      if (!product.category || !selectedCategories.includes(product.category.slug)) {
        return false;
      }
    }

    // Price filter check
    const numericPrice = typeof product.price === "string" ? parseFloat(product.price) : product.price;

    if (priceRange.min !== "" && numericPrice < parseFloat(priceRange.min)) {
      return false;
    }

    if (priceRange.max !== "" && numericPrice > parseFloat(priceRange.max)) {
      return false;
    }

    return true;
  });

  // Map products to format expected by ProductGrid (translating names dynamically)
  const formattedProducts = filteredProductsList.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name[lang as keyof typeof product.name] || product.name.en,
    image: product.image,
    price: product.price,
    oldPrice: product.oldPrice,
    link: `/products/${product.slug}`,
  }));

  return (
    <main dir={isRTL ? "rtl" : "ltr"} className="w-full bg-[var(--color-background)] min-h-screen">
      {/* Dynamic Category Hero */}
      <ShopHero data={localizedHero} />

      {/* Main Content Layout (Full Width Stacked Top to Bottom layout matching ShopPage) */}
      <section className="mx-auto max-w-[var(--container-2xl)] px-[var(--spacing-4)] py-[var(--spacing-12)] sm:px-[var(--spacing-6)] lg:px-[var(--spacing-8)]">
        
        {/* Top Horizontal Dropdown Filters with Search & Range Presets */}
        <ShopFilters
          data={globalFilters}
          selectedCategories={selectedCategories}
          onCategoryChange={setSelectedCategories}
          priceRange={priceRange}
          onPriceChange={setPriceRange}
          onReset={() => {
            setSelectedCategories(categorySlug ? [categorySlug] : []);
            setPriceRange({ min: "", max: "" });
          }}
        />

        {/* Filtered Product Grid */}
        <ProductGrid products={formattedProducts} />

      </section>
    </main>
  );
}