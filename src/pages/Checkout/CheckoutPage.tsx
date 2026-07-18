import { useState } from "react";
import { useTranslation } from "react-i18next";

import CheckoutProgress from "@/components/Checkout/CheckoutProgress";
import CheckoutContact, {
  type CheckoutContactData,
} from "@/components/Checkout/CheckoutContact";

import ShippingAddress, {
  type ShippingAddressData,
} from "@/components/Checkout/ShippingAddress";

import BillingAddress, {
  type BillingAddressData,
} from "@/components/Checkout/BillingAddress";

import ShippingMethod, {
  type ShippingMethodType,
} from "@/components/Checkout/ShippingMethod";

import PaymentMethod, {
  type PaymentMethodType,
} from "@/components/Checkout/PaymentMethod";

import OrderNotes from "@/components/Checkout/OrderNotes";
import CheckoutSummary from "@/components/Checkout/CheckoutSummary";

import { useNavigate } from "react-router-dom";


export default function CheckoutPage() {
  const { t } = useTranslation("checkout");


  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const [contact, setContact] =
    useState<CheckoutContactData>({
      fullName: "",
      email: "",
      phone: "",
    });


  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddressData>({
      fullName: "",
      phone: "",
      country: "",
      city: "",
      addressLine1: "",
      addressLine2: "",
      postalCode: "",
    });


  const [billingAddress, setBillingAddress] =
    useState<BillingAddressData>({
      fullName: "",
      address: "",
      city: "",
      country: "",
      postalCode: "",
    });


  const [shippingMethod, setShippingMethod] =
    useState<ShippingMethodType>("standard");


  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodType>("cash");


  const [notes, setNotes] =
    useState("");


  // Fake cart data
  const subtotal = 220;


  const shipping =
    shippingMethod === "express"
      ? 15
      : shippingMethod === "standard"
      ? 5
      : 0;


  const tax = 20;

  const discount = 10;


  const total =
    subtotal +
    shipping +
    tax -
    discount;



    const handlePlaceOrder = async () => {
      try {
        setLoading(true);

        // محاكاة انتظار الشبكة
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const orderId = Date.now();

        const order = {
          id: orderId,
          status: "pending",
          createdAt: new Date().toISOString(),

          contact,
          shippingAddress,
          billingAddress,
          shippingMethod,
          paymentMethod,
          notes,

          summary: {
            subtotal,
            shipping,
            tax,
            discount,
            total,
            currency: "USD",
          },

          // بيانات وهمية للمنتجات
          items: [
            {
              id: 1,
              name: "Wireless Headphones",
              price: 120,
              quantity: 1,
              image: "/images/products/headphones.jpg",
            },
            {
              id: 2,
              name: "Smart Watch",
              price: 100,
              quantity: 1,
              image: "/images/products/watch.jpg",
            },
          ],
        };

        const orders = JSON.parse(
          localStorage.getItem("orders") ?? "[]"
        );

        orders.unshift(order);

        localStorage.setItem(
          "orders",
          JSON.stringify(orders)
        );

        // تفريغ السلة إذا كنت تستخدمها
        localStorage.removeItem("cart");

        navigate(`/order/success/${orderId}`);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };



  return (
    <main className="mx-auto max-w-[var(--container-xl)] px-4 py-8">

      <CheckoutProgress current="checkout" />


      <header className="mb-8">

        <h1 className="text-3xl font-bold">
          {t("title")}
        </h1>


        <p className="mt-2 text-[var(--color-text-secondary)]">
          {t("description")}
        </p>

      </header>



      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">


        <section className="space-y-6">


          <CheckoutContact
            value={contact}
            onChange={setContact}
          />


          <ShippingAddress
            value={shippingAddress}
            onChange={setShippingAddress}
          />


          <BillingAddress
            value={billingAddress}
            onChange={setBillingAddress}
          />


          <ShippingMethod
            value={shippingMethod}
            onChange={setShippingMethod}
            currency="USD"
          />


          <PaymentMethod
            value={paymentMethod}
            onChange={setPaymentMethod}
          />


          <OrderNotes
            value={notes}
            onChange={setNotes}
          />


        </section>



        <aside>

          <CheckoutSummary
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            discount={discount}
            total={total}
            currency="USD"
            loading={loading}
            onPlaceOrder={handlePlaceOrder}
          />

        </aside>


      </div>

    </main>
  );
}


// OrderSuccessPage.tsx
//         ↓
// OrderDetailsPage.tsx
//         ↓
// OrderItems.tsx
//         ↓
// OrderStatus.tsx
//         ↓
// Laravel Orders API