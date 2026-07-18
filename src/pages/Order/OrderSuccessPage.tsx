import { Link, useParams } from "react-router-dom";
import { CheckCircle, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

export default function OrderSuccessPage() {
  const { t } = useTranslation("order");

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
    <main className="mx-auto flex min-h-[60vh] items-center justify-center">
      <p>{t("success.notFound")}</p>
    </main>
  );
}

  return (
    <main
      className="
        mx-auto
        flex
        min-h-[70vh]
        max-w-[var(--container-md)]
        items-center
        justify-center
        px-4
        py-10
      "
    >
      <div
        className="
          w-full
          rounded-2xl
          border
          border-[var(--color-border)]
          bg-[var(--color-background)]
          p-8
          text-center
        "
      >

        <div
          className="
            mx-auto
            mb-6
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-full
            bg-[var(--color-success)]
            text-white
          "
        >
          <CheckCircle size={42} />
        </div>


        <h1
          className="
            text-3xl
            font-bold
          "
        >
          {t("success.title")}
        </h1>


        <p
          className="
            mt-4
            text-[var(--color-text-secondary)]
          "
        >
          {t("success.message")}
        </p>

    {order && (
  <div
    className="
      mt-6
      rounded-2xl
      border
      border-[var(--color-border)]
      bg-[var(--color-surface)]
      p-5
      text-start
      space-y-4
    "
  >
    <div className="flex items-center justify-between">
      <span className="text-[var(--color-text-secondary)]">
        {t("success.orderNumber")}
      </span>

      <span className="font-bold">
        #{order.id}
      </span>
    </div>

    <div className="flex items-center justify-between">
      <span className="text-[var(--color-text-secondary)]">
        {t("success.status")}
      </span>

      <span
        className="
          rounded-full
          bg-yellow-100
          px-3
          py-1
          text-sm
          font-medium
          text-yellow-700
        "
      >
        {order.status}
      </span>
    </div>

    <div className="flex items-center justify-between">
      <span className="text-[var(--color-text-secondary)]">
        {t("success.total")}
      </span>

      <span className="font-semibold">
        ${order.summary.total}
      </span>
    </div>

    <div className="flex items-center justify-between">
      <span className="text-[var(--color-text-secondary)]">
        {t("success.date")}
      </span>

      <span>
        {new Date(order.createdAt).toLocaleDateString()}
      </span>
    </div>
  </div>
)}

        <div
          className="
            mt-8
            flex
            flex-col
            gap-3
          "
        >

          <Link
            to={`/orders/${id}`}
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[var(--color-primary)]
              px-6
              py-3
              text-white
              transition
              hover:bg-[var(--color-primary-hover)]
            "
          >
            <ShoppingBag size={18} />

            {t("success.viewOrder")}
          </Link>


          <Link
            to="/shop"
            className="
              rounded-xl
              border
              border-[var(--color-border)]
              px-6
              py-3
              transition
              hover:bg-[var(--color-surface)]
            "
          >
            {t("success.continueShopping")}
          </Link>

        </div>

        

      </div>
    </main>
  );
}