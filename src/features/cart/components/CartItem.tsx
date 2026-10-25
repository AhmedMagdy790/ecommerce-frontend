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
  const { isRTL, lang } = useLang();
  const { t } = useTranslation("cart");

  if (!item) return null;

  const getProductName = () => {
    return item.product?.name ?? "";
  };

  return (
    <div 
      dir={isRTL ? "rtl" : "ltr"}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 rounded-panel bg-surface border border-border shadow-xs gap-4 transition-all hover:border-border-hover"
    >
      
      {/* Product Details Info */}
      <div className="flex flex-col gap-1">
        <h3 
          className="text-base font-bold text-text-primary"
          style={{ fontFamily: isRTL ? "var(--font-arabic)" : "var(--font-sans)" }}
        >
          {getProductName()}
        </h3>

        <div className="flex flex-wrap items-center gap-3 text-xs text-text-secondary">
          {item.variant?.sku && (
            <span>
              {t("sku", { defaultValue: lang === "ar" ? "رمز المنتج:" : "SKU:" })} <strong className="text-text-primary">{item.variant.sku}</strong>
            </span>
          )}
          {item.variant?.attributes?.color && (
            <span>
              {t("color", { defaultValue: lang === "ar" ? "اللون:" : "Color:" })} <strong className="text-text-primary">{item.variant.attributes.color}</strong>
            </span>
          )}
          {item.variant?.attributes?.size && (
            <span>
              {t("size", { defaultValue: lang === "ar" ? "المقاس:" : "Size:" })} <strong className="text-text-primary">{item.variant.attributes.size}</strong>
            </span>
          )}
        </div>

        <div className="text-sm font-semibold text-primary mt-1">
          {formatCurrency(item.variant?.price)} <span className="text-xs text-text-muted font-normal">({isRTL ? "للقطعة" : "each"})</span>
        </div>
      </div>

      {/* Actions & Item Total */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-6">
        
        {/* Quantity Controls */}
        <div className="flex items-center border border-border rounded-card bg-surface-secondary overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => onDecrease?.(item.id)}
            disabled={item.quantity <= 1}
            className="p-2 hover:bg-surface transition-colors text-text-primary disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          
          <span className="px-4 text-sm font-semibold text-text-primary min-w-8 text-center">
            {item.quantity}
          </span>

          <button
            type="button"
            onClick={() => onIncrease?.(item.id)}
            className="p-2 hover:bg-surface transition-colors text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Item Total Price */}
        <div className="text-end min-w-[80px]">
          <span className="text-base font-bold text-text-primary">
            {formatCurrency(item.item_total)}
          </span>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={() => onRemove?.(item.id)}
          className="p-2 rounded-card text-red-500 hover:bg-red-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          aria-label="Remove item"
        >
          <Trash2 size={18} />
        </button>

      </div>

    </div>
  );
}