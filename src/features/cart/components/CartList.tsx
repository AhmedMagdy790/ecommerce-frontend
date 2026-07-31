// src/components/cart/CartList.tsx

import type { ICartItem } from "@/features/cart/types";
import CartItem from "./CartItem";
import { useLang } from "@/shared/context/LanguageContext";

interface CartListProps {
  items: ICartItem[];
  onIncrease?: (id: number | string) => void;
  onDecrease?: (id: number | string) => void;
  onRemove?: (id: number | string) => void;
}

export default function CartList({
  items,
  onIncrease,
  onDecrease,
  onRemove,
}: CartListProps) {
  const { isRTL } = useLang();

  // Guard clause: filter out any null/undefined items just in case
  const validItems = items?.filter(Boolean) || [];

  if (validItems.length === 0) return null;

  return (
    <ul
      dir={isRTL ? "rtl" : "ltr"}
      role="list"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-4)",
        listStyle: "none",
        margin: 0,
        padding: 0,
      }}
    >
      {validItems.map((item, index) => {
        // Debug safeguard log
        if (!item) {
          console.warn(`CartList: item at index ${index} is undefined`);
          return null;
        }

        return (
          <li key={item.id ?? index} style={{ width: "100%" }}>
            <CartItem
              item={item}
              onIncrease={onIncrease}
              onDecrease={onDecrease}
              onRemove={onRemove}
            />
          </li>
        );
      })}
    </ul>
  );
}