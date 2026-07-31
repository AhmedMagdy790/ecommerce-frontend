// src/pages/Wishlist/WishlistPage.tsx

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Heart, Trash2 } from "lucide-react";
import { useLang } from "@/shared/context/LanguageContext";

import WishlistItem from "./components/WishlistItem";
import EmptyWishlist from "./components/EmptyWishlist";

const initialWishlistData = {
  items: [
    {
      id: "1",
      name: { ar: "حقيبة ظهر جلدية فاخرة", en: "Luxury Leather Backpack" },
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
      price: 120,
      oldPrice: 150,
      stock: true,
    },
    {
      id: "2",
      name: { ar: "حذاء رياضي عصري مريح", en: "Modern Comfort Sneakers" },
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      price: 90,
      stock: true,
    },
  ],
};

export default function WishlistPage() {
  const { t } = useTranslation("common");
  const { lang, isRTL } = useLang();
  const [wishlist, setWishlist] = useState(initialWishlistData.items);

  const isEmpty = wishlist.length === 0;

  const handleRemove = (id: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    setWishlist([]);
  };

  const handleAddToCart = (id: string) => {
    console.log(`Added item ${id} to cart from wishlist`);
  };

  if (isEmpty) {
    return <EmptyWishlist />;
  }

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full min-h-[85vh] bg-[var(--color-background)] text-[var(--color-text-primary)] py-[var(--spacing-12)] px-[var(--spacing-4)] sm:px-[var(--spacing-6)] lg:px-[var(--spacing-8)] transition-colors duration-[var(--duration-normal)]"
    >
      <div className="mx-auto max-w-[var(--container-2xl)]">
        
        {/* Page Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[var(--color-border)] mb-[var(--spacing-10)] pb-[var(--spacing-6)] gap-[var(--spacing-4)]">
          <div className="flex flex-col gap-[var(--spacing-2)]">
            <div className="inline-flex items-center gap-[var(--spacing-2)]">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-[var(--radius-md)] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-primary)]">
                <Heart size={18} strokeWidth={2.2} />
              </span>
              <span 
                className="text-[var(--text-xs)] font-[var(--font-semibold)] text-[var(--color-primary)] uppercase tracking-wider"
                style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
              >
                {lang === "ar" ? "المفضلة لديك" : "Your Saved Favorites"}
              </span>
            </div>

            <h1 
              className="text-[var(--text-3xl)] sm:text-[var(--text-4xl)] font-[var(--font-bold)] tracking-tight text-[var(--color-text-primary)]"
              style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
            >
              {lang === "ar" ? "قائمة الأمنيات" : "Wishlist"}
            </h1>
            
            <p 
              className="text-[var(--text-sm)] text-[var(--color-text-secondary)]"
              style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
            >
              {lang === "ar" 
                ? `لديك ${wishlist.length} منتجات محفوظة في قائمة الأمنيات الخاصة بك.` 
                : `You have ${wishlist.length} items saved in your wishlist.`}
            </p>
          </div>

          {/* Action Header Buttons */}
          <div className="flex items-center gap-[var(--spacing-3)]">
            <button
              onClick={handleClearAll}
              className="inline-flex items-center h-10 px-[var(--spacing-4)] rounded-[var(--radius-xl)] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-error)] text-[var(--text-sm)] font-[var(--font-medium)] gap-[var(--spacing-2)] transition-all duration-[var(--duration-fast)] ease-[var(--ease-default)] hover:opacity-80 active:scale-95"
              style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
            >
              <Trash2 size={16} strokeWidth={2} />
              <span>{lang === "ar" ? "إفراغ القائمة" : "Clear Wishlist"}</span>
            </button>
          </div>
        </div>

        {/* Grid Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[var(--spacing-6)]">
          {wishlist.map((product) => (
            <WishlistItem
              key={product.id}
              data={product}
              onRemove={handleRemove}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

      </div>
    </main>
  );
}