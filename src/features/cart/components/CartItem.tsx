// src/components/cart/CartItem.tsx

import type { ICartItem } from "@/features/cart/model/types/cart.types";
import { useLang } from "@/shared/context/LanguageContext";
import { formatCurrency } from "@/shared/utils/currency";
import { Trash2, Plus, Minus } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CartItemProps {
  item: ICartItem;
  onIncrease?: (id: number | string) => void;
  onDecrease?: (id: number | string) => void;
  onRemove?: (id: number | string) => void;
}

export default function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  const { isRTL } = useLang();
  const { t } = useTranslation("cart");

  if (!item) return null;

  const getProductName = () => {
    return item.product?.name ?? "";
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 rounded-[var(--radius-2xl)] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs gap-4">
      
      {/* Product Details Info */}
      <div className="flex flex-col gap-1">
        <h3 
          className="text-[var(--text-base)] font-[var(--font-bold)] text-[var(--color-text-primary)]"
          style={{ fontFamily: isRTL ? "var(--font-arabic)" : "var(--font-sans)" }}
        >
          {getProductName()}
        </h3>

        <div className="flex flex-wrap items-center gap-3 text-[var(--text-xs)] text-[var(--color-text-secondary)]">
          <span>
            {t("cart.sku")}: <strong className="text-[var(--color-text-primary)]">{item.variant?.sku}</strong>
          </span>
          {item.variant?.attributes?.color && (
            <span>
              {t("cart.color")}: <strong className="text-[var(--color-text-primary)]">{item.variant.attributes.color}</strong>
            </span>
          )}
          {item.variant?.attributes?.size && (
            <span>
              {t("cart.size")}: <strong className="text-[var(--color-text-primary)]">{item.variant.attributes.size}</strong>
            </span>
          )}
        </div>

        <div className="text-[var(--text-sm)] font-[var(--font-semibold)] text-[var(--color-primary)] mt-1">
          {formatCurrency(item.variant?.price)} <span className="text-xs text-[var(--color-text-muted)] font-normal">({isRTL ? "للقطعة" : "each"})</span>
        </div>
      </div>

      {/* Actions & Item Total */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-6">
        
        {/* Quantity Controls */}
        <div className="flex items-center border border-[var(--color-border)] rounded-[var(--radius-xl)] bg-[var(--color-surface-secondary)] overflow-hidden">
          <button
            type="button"
            onClick={() => onDecrease?.(item.id)}
            disabled={item.quantity <= 1}
            className="p-2 hover:bg-[var(--color-border)] transition-colors text-[var(--color-text-primary)] disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          
          <span className="px-4 text-[var(--text-sm)] font-[var(--font-semibold)] text-[var(--color-text-primary)]">
            {item.quantity}
          </span>

          <button
            type="button"
            onClick={() => onIncrease?.(item.id)}
            className="p-2 hover:bg-[var(--color-border)] transition-colors text-[var(--color-text-primary)]"
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Item Total Price */}
        <div className="text-right min-w-[80px]">
          <span className="text-[var(--text-base)] font-[var(--font-bold)] text-[var(--color-text-primary)]">
            {formatCurrency(item.item_total)}
          </span>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={() => onRemove?.(item.id)}
          className="p-2 rounded-[var(--radius-xl)] text-red-500 hover:bg-red-500/10 transition-colors"
          aria-label="Remove item"
        >
          <Trash2 size={18} />
        </button>

      </div>

    </div>
  );
}