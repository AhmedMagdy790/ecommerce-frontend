// src/components/cart/CartList.tsx

import type { ICartItem } from "@/features/cart/model/types/cart.types";
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
      className="flex flex-col gap-4 list-none m-0 p-0 w-full"
    >
      {validItems.map((item, index) => {
        // Debug safeguard log
        if (!item) {
          console.warn(`CartList: item at index ${index} is undefined`);
          return null;
        }

        return (
          <li key={item.id ?? index} className="w-full">
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