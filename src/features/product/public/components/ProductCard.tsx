import { useTranslation } from "react-i18next";
import type { Product } from "../../model/types/product.types";

interface ProductCardProps {
  product: Product<string>;
  badge?: string; // The translation key for the badge
}

export function ProductCard({ product, badge }: ProductCardProps) {
  const { t } = useTranslation("home");

  return (
    <a
      href={`/products/${product.slug ?? product.id}`}
      className="group relative block overflow-hidden rounded-2xl border border-border bg-surface"
    >
      {/* Badge Overlay */}
      {badge && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white shadow-sm">
          {t(badge)}
        </span>
      )}

      <div className="aspect-square overflow-hidden bg-surface-secondary">
        <img
          src={product.image}
          alt={t(product.name)}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-text-primary">{t(product.name)}</h3>
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