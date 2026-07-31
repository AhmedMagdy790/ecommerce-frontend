import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export interface SearchProduct {
  id: number;
  name: string;
  slug: string;
  image: string;
  price: number;
  currency: string;
}

interface SearchProductCardProps {
  product: SearchProduct;
}

export default function SearchProductCard({
  product,
}: SearchProductCardProps) {
  const { i18n } = useTranslation();

  const price = new Intl.NumberFormat(i18n.language, {
    style: "currency",
    currency: product.currency,
  }).format(product.price);

  return (
    <Link
      to={`/products/${product.slug}`}
      className="
        flex
        items-center
        gap-4
        rounded-xl
        p-3
        transition-colors
        hover:bg-[var(--color-surface)]
      "
    >
      <img
        src={product.image}
        alt={product.name}
        className="
          h-16
          w-16
          rounded-lg
          object-cover
          border
          border-[var(--color-border)]
        "
      />

      <div className="min-w-0 flex-1">
        <h3
          className="
            truncate
            font-medium
            text-[var(--color-text-primary)]
          "
        >
          {product.name}
        </h3>

        <p
          className="
            mt-1
            text-sm
            text-[var(--color-text-secondary)]
          "
        >
          {price}
        </p>
      </div>
    </Link>
  );
}