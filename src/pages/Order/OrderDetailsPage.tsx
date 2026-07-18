import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Package,
  ShoppingBag,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function OrderDetailsPage() {
  const { t, i18n } = useTranslation("order");
  const { id } = useParams();

  const order = useMemo(() => {
    const orders = JSON.parse(
      localStorage.getItem("orders") ?? "[]"
    );

    return orders.find(
      (item: { id: number }) => String(item.id) === id
    );
  }, [id]);

  if (!order) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-4">
        <div className="rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">
          <Package className="mx-auto mb-4 h-14 w-14 text-text-secondary" />

          <h1 className="text-2xl font-bold">
            {t("details.notFound")}
          </h1>

          <Link
            to="/"
            className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-white transition hover:opacity-90"
          >
            {t("back")}
          </Link>
        </div>
      </main>
    );
  }

  const formatPrice = (value: number) =>
    new Intl.NumberFormat(i18n.language, {
      style: "currency",
      currency: order.summary.currency,
    }).format(value);

  const statusClasses: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-indigo-100 text-indigo-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <Link
        to="/orders"
        className="mb-8 inline-flex items-center gap-2 text-sm text-primary transition hover:underline"
      >
        <ArrowLeft size={16} />
        {t("back")}
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <section className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">
                  {t("details.title")}
                </h1>

                <p className="mt-2 text-text-secondary">
                  #{order.id}
                </p>

                <p className="mt-1 text-sm text-text-secondary">
                  {new Date(order.createdAt).toLocaleString(i18n.language)}
                </p>
              </div>

              <span
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  statusClasses[order.status] ??
                  "bg-gray-100 text-gray-700"
                }`}
              >
                {t(`status.${order.status}`)}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2">
              <ShoppingBag size={20} />
              <h2 className="text-xl font-semibold">
                {t("details.items")}
              </h2>
            </div>

            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-xl border border-border p-4 transition hover:bg-surface-secondary"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 rounded-xl object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-sm text-text-secondary">
                      {t("details.quantity")}: {item.quantity}
                    </p>
                  </div>

                  <div className="font-semibold">
                    {formatPrice(item.price)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <MapPin size={20} />
              <h2 className="text-xl font-semibold">
                {t("details.shipping")}
              </h2>
            </div>

            <div className="space-y-2 text-text-secondary">
              <p>{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.addressLine1}</p>

              {order.shippingAddress.addressLine2 && (
                <p>{order.shippingAddress.addressLine2}</p>
              )}

              <p>
                {order.shippingAddress.city},{" "}
                {order.shippingAddress.country}
              </p>

              <p>{order.shippingAddress.postalCode}</p>
            </div>
          </div>
        </section>

        <aside className="sticky top-24 h-fit">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">
              {t("details.summary")}
            </h2>

            <div className="space-y-4">
              <Row
                label={t("subtotal")}
                value={formatPrice(order.summary.subtotal)}
              />

              <Row
                label={t("shipping")}
                value={formatPrice(order.summary.shipping)}
              />

              <Row
                label={t("tax")}
                value={formatPrice(order.summary.tax)}
              />

              <Row
                label={t("discount")}
                value={`-${formatPrice(order.summary.discount)}`}
              />

              <hr className="border-border" />

              <Row
                label={t("total")}
                value={formatPrice(order.summary.total)}
                bold
              />
            </div>

            <div className="mt-8 rounded-xl bg-surface-secondary p-4">
              <div className="flex items-center gap-3">
                <CreditCard size={18} />

                <div>
                  <p className="text-sm text-text-secondary">
                    {t("details.payment")}
                  </p>

                  <p className="font-medium">
                    {t(`payment.${order.paymentMethod}`)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

interface RowProps {
  label: string;
  value: string;
  bold?: boolean;
}

function Row({
  label,
  value,
  bold = false,
}: RowProps) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={
          bold
            ? "text-lg font-semibold"
            : "text-text-secondary"
        }
      >
        {label}
      </span>

      <span
        className={
          bold
            ? "text-lg font-bold"
            : "font-medium"
        }
      >
        {value}
      </span>
    </div>
  );
}