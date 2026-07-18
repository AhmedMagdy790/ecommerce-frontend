import type { Product } from "@/types/product";
import { useTranslation } from "react-i18next";


export const ProductCard = ({ product }: { product: Product }) => {
  const { t } = useTranslation("home");
  return (
    <a
      href={`/products/${product.slug ?? product.id}`}
      className="group overflow-hidden rounded-2xl border border-border bg-surface"
    >
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
            <span className="text-sm text-text-secondary line-through">${product.oldPrice}</span>
          )}
        </div>
      </div>
    </a>
  );
};
