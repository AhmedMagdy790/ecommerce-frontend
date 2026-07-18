import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface CartItemData {
  id: number;
  productId: number;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  currency: string;
  variant?: string;
}

interface CartItemProps {
  item: CartItemData;
  onIncrease?: (id: number) => void;
  onDecrease?: (id: number) => void;
  onRemove?: (id: number) => void;
}

export default function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  const { t, i18n } = useTranslation("cart");

  const currency = item.currency || "USD";

  const price = new Intl.NumberFormat(i18n.language, {
    style: "currency",
    currency,
  }).format(item.price);

  const total = new Intl.NumberFormat(i18n.language, {
    style: "currency",
    currency,
  }).format(item.price * item.quantity);

  return (
    <article
      className="
        flex
        gap-4
        rounded-xl
        border
        border-[var(--color-border)]
        bg-[var(--color-background)]
        p-4
      "
    >
      <Link to={`/products/${item.slug}`}>
        <img
          src={item.image}
          alt={item.name}
          className="h-24 w-24 rounded-lg object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col">
        <Link
          to={`/products/${item.slug}`}
          className="font-semibold hover:underline"
        >
          {item.name}
        </Link>

        {item.variant && (
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {item.variant}
          </p>
        )}

        <p className="mt-2 font-medium">
          {price}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <div
            className="
              flex
              items-center
              rounded-lg
              border
              border-[var(--color-border)]
            "
          >
            <button
              type="button"
              onClick={() => onDecrease?.(item.id)}
              className="p-2 hover:bg-[var(--color-surface)]"
              aria-label={t("decreaseQuantity")}
            >
              <Minus size={18} />
            </button>

            <span className="min-w-10 text-center">
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={() => onIncrease?.(item.id)}
              className="p-2 hover:bg-[var(--color-surface)]"
              aria-label={t("increaseQuantity")}
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-semibold">
              {total}
            </span>

            <button
              type="button"
              onClick={() => onRemove?.(item.id)}
              className="
                rounded-lg
                p-2
                text-[var(--color-error)]
                hover:bg-[var(--color-surface)]
              "
              aria-label={t("removeItem")}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}