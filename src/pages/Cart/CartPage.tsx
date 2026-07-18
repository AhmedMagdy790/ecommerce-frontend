import { useTranslation } from "react-i18next";

import CartList from "@/components/cart/CartList";
import CartSummary from "@/components/cart/CartSummary";
import EmptyCart from "@/components/cart/EmptyCart";

import type { CartItem } from "@/components/cart/CartItem";

// Fake Data
const cartItems: CartItem[] = [
  {
    id: 1,
    name: "Nike Air Max",
    image: "/images/products/shoe.jpg",
    price: 120,
    quantity: 2,
  },
  {
    id: 2,
    name: "Leather Backpack",
    image: "/images/products/bag.jpg",
    price: 85,
    quantity: 1,
  },
];

export default function CartPage() {
  const { t } = useTranslation("cart");

  const items = cartItems;

  const subtotal = items.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const shipping = subtotal >= 200 ? 0 : 10;

  const tax = subtotal * 0.14;

  const discount = 0;

  const total =
    subtotal + shipping + tax - discount;

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <main className="mx-auto max-w-[var(--container-xl)] px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">
          {t("title")}
        </h1>

        <p className="mt-2 text-[var(--color-text-secondary)]">
          {t("description")}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <section>
          <CartList items={items} />
        </section>

        <aside>
          <CartSummary
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            discount={discount}
            total={total}
            currency="USD"
          />
        </aside>
      </div>
    </main>
  );
}