// src/components/cart/CartItem.tsx

import type { ICartItem } from "@/features/cart/types";
import { useLang } from "@/shared/context/LanguageContext";
import { formatCurrency } from "@/shared/utils/currency";
import { Trash2, Plus, Minus } from "lucide-react";

export interface CartItemData {
  id: number | string;
  quantity: number;
  item_total: number;
  product: {
    id: number | string;
    name: { ar?: string; en?: string } | string;
    slug?: string;
  };
  variant: {
    id: number | string;
    sku: string;
    color: string | null;
    size: string | null;
    price: number;
  };
}

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
  const { lang } = useLang();

  // Safeguard if item is somehow not fully populated yet
  if (!item) return null;

  // Extract localized product name safely
  const getProductName = () => {
    const nameObj = item.product?.name;
    if (!nameObj) return "";
    if (typeof nameObj === "string") return nameObj;
    return nameObj[lang as keyof typeof nameObj] || nameObj.en || nameObj.ar || "";
  };

  const isArabic = lang === "ar";

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 rounded-[var(--radius-2xl)] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs gap-4">
      
      {/* Product Details Info */}
      <div className="flex flex-col gap-1">
        <h3 
          className="text-[var(--text-base)] font-[var(--font-bold)] text-[var(--color-text-primary)]"
          style={{ fontFamily: isArabic ? "var(--font-arabic)" : "var(--font-sans)" }}
        >
          {getProductName()}
        </h3>

        <div className="flex flex-wrap items-center gap-3 text-[var(--text-xs)] text-[var(--color-text-secondary)]">
          <span>
            {isArabic ? "الوحدة:" : "SKU:"} <strong className="text-[var(--color-text-primary)]">{item.variant?.sku}</strong>
          </span>
          {item.variant?.color && (
            <span>
              {isArabic ? "اللون:" : "Color:"} <strong className="text-[var(--color-text-primary)]">{item.variant.color}</strong>
            </span>
          )}
          {item.variant?.size && (
            <span>
              {isArabic ? "المقاس:" : "Size:"} <strong className="text-[var(--color-text-primary)]">{item.variant.size}</strong>
            </span>
          )}
        </div>

        <div className="text-[var(--text-sm)] font-[var(--font-semibold)] text-[var(--color-primary)] mt-1">
          {formatCurrency(item.variant?.price)} <span className="text-xs text-[var(--color-text-muted)] font-normal">({isArabic ? "للقطعة" : "each"})</span>
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