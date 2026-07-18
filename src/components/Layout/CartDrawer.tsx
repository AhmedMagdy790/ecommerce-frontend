import { useTranslation } from "react-i18next";
import { type ProductSummary } from "@/types/product"; // Assuming shared types

interface ProductCardProps {
  product: ProductSummary;
  // We pass the badge as a prop to make this card reusable
  badge?: string; 
}

export function ProductCard({ product, badge }: ProductCardProps) {
  const { t } = useTranslation("home"); // Or "common"

  return (
    <a
      href={product.link || "#"}
      className="group overflow-hidden rounded-2xl border border-border bg-surface block"
    >
      <div className="relative aspect-square overflow-hidden bg-surface-secondary">
        <img
          src={product.image}
          alt={t(product.name)}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Enterprise Note: Dynamic Badge rendering */}
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-black px-3 py-1 text-xs text-white z-10">
            {t(badge)}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-text-primary truncate">
          {t(product.name)}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          <span className="font-bold text-primary">${product.price}</span>
          {product.oldPrice && (
            <span className="text-sm text-text-secondary line-through">
              ${product.oldPrice}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}