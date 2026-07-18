import CartItem, {
  type CartItemData,
} from "./CartItem";

interface CartListProps {
  items: CartItemData[];
  onIncrease?: (id: number) => void;
  onDecrease?: (id: number) => void;
  onRemove?: (id: number) => void;
}

export default function CartList({
  items,
  onIncrease,
  onDecrease,
  onRemove,
}: CartListProps) {
  return (
    <section className="space-y-4">
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
          onRemove={onRemove}
        />
      ))}
    </section>
  );
}